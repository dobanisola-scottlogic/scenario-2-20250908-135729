import org.jboss.resteasy.client.jaxrs.BasicAuthentication
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder
import org.sonatype.nexus.script.ScriptClient
import org.sonatype.nexus.script.ScriptXO

/*================================================================================
  Groovy script to upload and run the setupNexus.groovy script on the nexus server
  ================================================================================*/

CliBuilder cli = new CliBuilder(usage: 'groovy uploadAndRunScript.groovy -u <user> -p <password> [-h <host>]')
cli.with {
    u longOpt: 'username', args: 1, required: true, 'A User with permission to use the NX3 Script resource'
    p longOpt: 'password', args: 1, required: true, 'Password for given User'
    h longOpt: 'host', args: 1, 'NX3 host name name (including port if necessary). Defaults to http://localhost:8081'
}
def options = cli.parse(args)
if (!options) {
    return
}

def file = new File('groovy/setupNexus.groovy')
assert file.exists()

def name = 'setupNexus'

def host = options.h ?: 'http://localhost:8081'
def resource = 'service/rest'

ScriptClient scripts = new ResteasyClientBuilder()
        .build()
        .register(new BasicAuthentication(options.u, options.p))
        .target("$host/$resource")
        .proxy(ScriptClient)


def script = new ScriptXO(name, file.text, 'groovy')
println "Uploading script file '$file' with name: $name"
scripts.add(script)

println "Stored scripts are now: ${scripts.browse().collect { it.name }}"

println "Running script: $name"
scripts.run(name, '')
