import {getMyHospitalCascadeList,getThreeAreaCascadeList,getSysDepartment } from "@/utils/api.js";
export async function getAreaList(){// 获取省，市，区
    let {code,result,message} =await getThreeAreaCascadeList();
    if(code==200){
      uni.setStorageSync("area", JSON.stringify(result));
    }
  }
  export async function getHosList(){   // 获取省，市，区，医院
    console.log("选择医院加载成功");
    let {code,result,message} =await getMyHospitalCascadeList();
    if(code==200){
      console.log("result",result);
      uni.setStorageSync("hospital", JSON.stringify(result)); //医院选择框
    }
  }
  export async function getProvinceCity(){ // 获取省，市
    let {code,result,message} =await getSysDepartment();
    if(code==200){
      uni.setStorageSync("provinceCity", JSON.stringify(result)); //医院选择框
    }
  }