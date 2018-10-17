import org.apache.http.HttpHeaders
import org.apache.http.HttpRequest
import org.apache.http.HttpRequestInterceptor
import org.apache.http.HttpStatus
import org.apache.http.client.HttpResponseException
import org.apache.http.client.methods.HttpPost
import org.apache.http.client.methods.HttpPut
import org.apache.http.entity.ContentType
import org.apache.http.entity.FileEntity
import org.apache.http.impl.client.HttpClients
import org.apache.http.protocol.HttpContext
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

HttpClients.createDefault().with { client ->
    ['jdk-windows.zip', 'jdk-linux.tgz'].each { fileName ->
        def jdkFile = new File(fileName)
        println "pushing $jdkFile"
        HttpPut put = new HttpPut("${host}/repository/java/${fileName}")
        put.setHeader(HttpHeaders.AUTHORIZATION, 'Basic ' + "${options.u}:${options.p}".bytes.encodeBase64())
        put.setHeader(HttpHeaders.CONTENT_TYPE, ContentType.APPLICATION_OCTET_STREAM.toString())
        put.entity = new FileEntity(jdkFile)
        client.execute(put) { response ->
            println "Upload repsonse from nexus: ${response.statusLine}"
            if (response.statusLine.statusCode < 200 || response.statusLine.statusCode >= 300) {
                throw new HttpResponseException(response.statusLine.statusCode, "Failed to upload java dist.")
            }
        }
    }
}
