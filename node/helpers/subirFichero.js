import ftp from 'basic-ftp';

export const subirFichero = async (file) => {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        //if(!(file instanceof File)) throw new Error('El parametro no es un fichero.');
        await client.access({
            host: "localhost",
            port: 21,
            user: "ftp",
            password: "ftp"
        })
        console.log(await client.list())
        // await client.uploadFrom("README.md", "README_FTP.md")
        // await client.downloadTo("README_COPY.md", "README_FTP.md")
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}