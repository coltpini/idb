import Idbify from '/idbify.js'

document.idb = new Idbify({
  schema: [
    {name: `the_key`, type: `keyPath`},
    {name: `the_index`, type:`index`, options: {unique: false}}
  ],
  storeName: `idbify_test_store`,
  v: 1
})

let i = 10
while(i--){
  document.idb.put({
    the_key: i,
    the_index: `group ${i%2}`,
    the_value: `value ${i}`
  })
}
