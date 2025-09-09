export const uplodToCloudnary=async(pics)=>{

    if(pics){
        const data = new FormData();
        data.append("file",pics)
        data.append("upload_preset","mjqmabah")
        data.append("cloud_name","dhxfhjo5r")

        const res = await fetch("https://api.cloudinary.com/v1_1/dhxfhjo5r/image/upload",{
            method:"post",
            body:data
        })

        const filedata=await res.json();
        return filedata.url.toString();
    }
    else console.log("Error from upload function")
}