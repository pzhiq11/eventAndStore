## Use
import esm from "@pzhiq/esm"
esm.event.on('test',()=>{
console.log("收到事件啦");
})
esm.store.on('mainData',(e)=>{
console.log("监听到值变化",e);
})
setTimeout(() => {
esm.event.emit("test");
esm.store.update("mainData",{level:5})
}, 2000);

esm.event.on("event1",(arg1)=>{});
esm.event.emit("event1",1);
esm.store.set({a:{b:1}});
esm.store.on("a.b",(v)=>{},true);
esm.store.update("a.b",2);
