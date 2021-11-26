function removeArrayElement(array, value){
    let length = array.length;
    let pos = array.indexOf(value);
    if(pos === 0){
        return array.slice(1,length);
    }else{
        return array.slice(0,pos).concat(array.slice(pos+1, length));
    }



}


function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


function roundFloat(float, deci){
    let factor = Math.pow(10, deci+1);
    return (Math.round(float*factor))/factor;
}