let Productos = ["arroz","fideos","jabon","terraneitor"];

console.log("stock normal");
for (let i = 0; i < Productos.length; i++) {
    console.log(Productos[i]);
    
}
console.log(" ");
console.log("stock actualizado despues de una venta");
Productos.pop();
for (let i = 0; i < Productos.length; i++) {
    console.log(Productos[i]);
}