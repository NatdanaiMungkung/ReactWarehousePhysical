function add(a,b) {
    return a+b;
}
var myAdd = (a,b) => {
    return a+b;
}

var anotherAdd = (a,b) => a+b;

console.log(myAdd(1,2));
console.log(anotherAdd(1,5));