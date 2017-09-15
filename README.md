# idbify
A simple interface for IDB with promises, you can define your schema up front and then it provides put, delete, and get functions.

# Usage

Defining a schema:

The key can only be the first item in the array. If the first item is a string or an object that doesn't specify `key:true` then a key will not be created.

This would create a DB with `myKey` being the DB keyPath.
```
  let mySchema = [
    {
      name: 'myKey',
      type: 'keypath',
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
