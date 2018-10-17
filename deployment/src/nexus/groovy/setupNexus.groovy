
/*========================================================
  Script to setup repositories on Nexus.
  This must be uploaded and run on the Nexus server itself
  ========================================================*/
// Create proxy to download Gradle distributions from
repository.createRawProxy('gradle-distributions', 'https://services.gradle.org/distributions')
def javaBlob = blobStore.createFileBlobStore('java', 'java')
repository.createRawHosted('java', javaBlob.name)
