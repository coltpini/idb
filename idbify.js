export default class IDB {
  constructor({schema, storeName, v}){
    this.schema = schema;
    this.storeName = storeName;
    this.v = v;
    this.go();
  }
  go(){
    return new Promise( (res, rej) => {
  		const iReq = indexedDB.open(this.storeName, this.v);
  		iReq.addEventListener("error", e => rej(e.target.error));
  		iReq.addEventListener("success", e => res(e.target.result));
  		iReq.addEventListener("upgradeneeded", e => this.upgrade(e.target.result));
  		iReq.addEventListener('blocked', (e) => rej('blocked') );
  	} )
  }
  upgrade(db){
    let options = this.schema[0].options || {};
    if(this.schema[0].type === 'index'){
      options.keyPath = this.schema[0].name;
    }
    const os = db.createObjectStore(this.storeName, options);

    this.schema.filter( (item) => item.type === 'index')
    .forEach( item =>  os.createIndex(item.name, item.keyPath || item.name, item.options) );
  }
  getTransaction(db){
    const trx = db.transaction(this.storeName, `readwrite`);
    const store = trx.objectStore(this.storeName);
    return { trx, store };
  }
  put(data){
    return this.go().then( db => {
      let {trx, store} = this.getTransaction(db);
      !Array.isArray(data) && (data = [data]);
      data.forEach( item => store.put(item))
      return new Promise( (res, rej) =>{
        trx.oncomplete = () => {
          db.close();
          res('completed');
        }
        trx.onerror = (e) => rej(e.target.error);
      })
    });
  }
  get(key){
    return this.go().then( db => {
      let {trx, store} = this.getTransaction(db);
      let read = store.get(key);
      return new Promise( (res,rej) => {
        read.onsuccess = () => res(read.result);
        read.onerror = () => rej('failed to read');
      })
    });
  }
  find(){
    // get using an index with cursors
  }
  delete(key){
    return this.go().then( db => {
      let {trx, store} = this.getTransaction(db);
      let remove = store.delete(key);
      return new Promise( (res,rej) => {
        remove.onsuccess = () => res('deleted');
        remove.onerror = () => rej('failed to delete');
      })
    });
  }
}
