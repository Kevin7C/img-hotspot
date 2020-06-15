
import ImgHotSpot from "./imghotspot";
// import img from "./11.jpg";

const HotSpot=new ImgHotSpot({
    element:"root"
})

const fileDom=document.getElementById("file");
fileDom.onchange=(e)=>{
    const files=e.target.files;
    console.log("fdfd",e)
    const reader=new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadstart=function () {
        console.log('文件上传处理......')
    };
    //操作完成
    reader.onload = function(e){
        //file 对象的属性
        // img.setAttribute('src',reader.result);
        HotSpot.setImg(reader.result);
    };
}



