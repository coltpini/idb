# idbify
A simple interface for IDB with promises, you can define your schema up front and then it provides put, delete, and get functions.

# Usage

##Defining a schema:

The key can only be the first item in the array. If the first item is a string or an object that doesn't specify `key:true` then a key will not be created.

This would create a DB with `myKey` being the DB keyPath.
```
  let mySchema = [
    {
      name: 'myKey',
      type: 'keyPath',
      options: {
        // you can add the options here that createObjectStore uses, except keyPath, this will take care of that for you.
      }
    }
  ]
```

This would create a DB with no key, and indexes on `anIndexedField`.
```
  let mySchema = [
    {
      name: 'anIndexedField',
      keyPath: ['anIndexedField','alongWithThisOne'],
      // if you don't define a keyPath then the name will be used.
      type: index,
      options: {
        unique: false
        // this could also be unique, depending on your data.
      }
    }
  ]
```

You only need to define the key and indexes, no need to worry about non key or index fields in your data.

## Creating an Instance:

To create and instance:
```
const idb_myStore = Idbify({schema, storeName: 'myStore', v: 1});
```

That will initialize the idb and store the schema for if the structure needs to be rebuilt.

## Functions and use:

- `put(data)`: this will take the object and add it to the iDB. It is a put so if it is a new key it will add it, if it is an existing key it will update it. This can be an array or a single object. If it is an array it will put each item in the array into the idb. This returns a promise that resolves to "completed" on success and an error on rejected.

- `get(key)`: This will get the entry at the specified key. This will return one result. If there is more than one entry for a key, non-unique key, it will return the first.

- `find({index, term, type="key"})`: This will return all the entries for the specified key/index.
  - `index`: this defines the context of the search. If you created an index in the schema you can specify that index here and it will search only on that index.
  - `term`: this is the value you are searching for in the index. This isn't similar to the `LIKE` in a where clause. You are searching for a specific key. If no key and term are used it will return the whole dataset and you can preform the filter on the returned array.
  - `type`: the default value for type is `key` and will return a list of keys based on the index set you chose. The other type available is `value` and will return the full object instead of just the key. There is a performance hit when using value so it is not recommended unless you know why you are doing it.

- `delete(key)`: this will delete a single record at the passed in key. If you want to delete multiple then you would use find to return what you need, then iterate over that filtered list to delete.

- `clear()`: this will remove all data in the store.

## Other functions.

The functions above would be the ones that you would normally use, but there may be some instances where you need something more. Such as stronger cursors in the find function. There are a few other internal functions that would be helpful for things like that.

- `go()`: this is the core functions and opens the idb and creates a promise that is returned based on the events that fire from the connection.

- `upgrade(db)`: this function runs from the `onupgradeneeded` event that gets fired from `go()`. This creates your idb if it isn't there.

- `getTransaction(db, type="readwrite")`: this takes the connection and returns the transaction and the store `{trx, store}` for use in the "crud" functions.

Using those functions you can get access to the native transaction or store like this:
```
  this.go().then( db => {
    const {trx, store} = this.getTransaction(db);
    // do something special
    // if you want to promise it, then return a new Promise with the results
    // from the onsuccess or onerror events!
  }
```

Happy coding!
