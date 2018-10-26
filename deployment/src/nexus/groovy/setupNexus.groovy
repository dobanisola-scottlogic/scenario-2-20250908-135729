
/*========================================================
  Script to setup repositories on Nexus.
  This must be uploaded and run on the Nexus server itself
  ========================================================*/

// Create proxy to download Gradle distributions from
repository.createRawProxy('gradle-distributions', 'https://services.gradle.org/distributions')

// Proxy to download AdoptOpenJDK builds
// This points to AdoptOpenJDK's GitHub organisation, which is redirected to from api.adoptopenjdk.net.
// Internet access to api.adoptopenjdk.net is still required in order to determine the path of the archive to download
repository.createRawProxy('openjdk', 'https://github.com/AdoptOpenJDK')
