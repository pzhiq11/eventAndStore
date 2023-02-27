## Use

p.event.on("event1",(arg1)=>{});
p.event.emit("event1",1);

p.store.set({a:{b:1}});
p.store.on("a.b",(v)=>{},true);
p.store.update("a.b",2);
