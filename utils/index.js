import { APOLLO_CLIENTS } from '@/helpers/constants.js'
import { useUserLoggedInStore } from '~/stores/userLoggedIn.js'


export function isEmpty(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length === 0;
  }
  return false;
}

export function logout() {
  const useUserLoggedIn = useUserLoggedInStore()
  useUserLoggedIn.setIsUserLoggedIn(false)
  useUserLoggedIn.setUserLoggedIn({})
  const { $auth } = useNuxtApp()
  $auth.removeToken()
  const router = useRouter()
  router.push("/auth/signin")
}

export async function getDataUserLoggedIn(nuxtApp, userStore) {
    const { $auth, $router } = nuxtApp
    const defaultClientApollo = nuxtApp.vueApp.config.globalProperties.$apolloProvider.clients.defaultClient
    const { data } = await defaultClientApollo.query({
      fetchPolicy: 'no-cache',
      query: readDineUpUser(`
        id
      `),
      variables: {
        me: true
      }
    }).catch(async (e) => {
      console.error("ERROR EN CONSULTAR USUARIO ", e)
      $auth.removeToken()
      userStore.setIsUserLoggedIn(false)
      $router.push('/auth/signin')
    })
    const config = useAppConfig()
    const user = { "id": "557fa04c-22ce-407e-8c5c-9c371123c687", "__typename": "DineUpUserType" } // JSON.parse(JSON.stringify(data.readDineUpUser))
    config.userLoggedIn = user
    nuxtApp.vueApp.config.globalProperties.$userLoggedIn = config.userLoggedIn
    userStore.setUserLoggedIn(config.userLoggedIn)
}

export const executeMutation = async (mutation, variables, client=APOLLO_CLIENTS.default) => {
  const { $apollo } = useNuxtApp()
  return await $apollo.mutate({
    client,
    mutation,
    variables
  })
}

export const executeQuery = async (query, variables, options={}, client=APOLLO_CLIENTS.default, ) => {
  const { $apollo } = useNuxtApp()
  return await $apollo.query({
    client,
    query,
    variables,
    ...options
  })
}

export const deleteKeys = (value, keys=['__typename']) => {
  if (Array.isArray(value)) {
    for (const o of value) {
      deleteKeys(o);
    }
  } else if (typeof value === 'object') {
    if (value) {
      for (let key of keys) {
        delete value[key];
      }
      for (const k in value) {
        deleteKeys(value[k]);
      }
    }
  }
}

export const removeTypename = (obj) => {
  if (typeof obj !== 'object') {
      return obj;
  }
  const newObj = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
      if (key !== '__typename') {
      newObj[key] = $removeTypename(obj[key]);
      }
  }
  return newObj;
}

export const isDefined = async (param) => {
  if (param !== '' && param !== undefined && param !== null) {
    return true
  }
  return false
}

export const sleep = async (ms) => {
  return new Promise((res) => setTimeout(res, ms))
}

export const formatDecimalNumber = async (number, thousandsSeparator='.', decimalSeparator=',', decimalPrecision=0) => {
  if (number) {
    var parts = number.toString().replace(thousandsSeparator, decimalSeparator).split(decimalSeparator);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    if (parts[1]) {parts[1] = parts[1].slice(0, decimalPrecision)}
    if (parts[1] === "") {parts.pop()}
    return parts.join(decimalSeparator);
  } else {
    return '0'
  }
}

export const convertPropertiesToIds = async (objFinal, objOriginal, excludeProperties=[]) => {
  for (const key in objOriginal) {
    if (Array.isArray(objOriginal[key])) {
      let i = 0;
      for (i; i < objOriginal[key].length; i++) {
        convertPropertiesToIds(objFinal[key][i], objOriginal[key][i]);
      }
    } else if (typeof objOriginal[key] === 'object') {
      if (!excludeProperties.includes(key)) {
        if (objOriginal[key]) {
          if ('id' in objOriginal[key]) {
            objFinal[key] = objOriginal[key].id;
          }
        }
      }
    }
  }
}

export const isObject = async () => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export const deleteElementInArray = async (element) => {
  if (Array.isArray(array)) {
    const index = array.indexOf(element);
    if (index > -1) {
      array.splice(index, 1);
    }
  }
  return array;
}

export const removeEmptyNestedObjectsAndArrays = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] instanceof Date || obj[key] instanceof RegExp || obj[key] instanceof Function || obj[key] instanceof File) {
        continue;
      }

      if (Array.isArray(obj[key])) {
        obj[key] = obj[key].filter(el => {
          if (typeof el === 'object' && el !== null) {
            removeEmptyNestedObjectsAndArrays(el);
            return !isEmpty(el);
          }
          return true;
        });
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        removeEmptyNestedObjectsAndArrays(obj[key]);
      }

      if (isEmpty(obj[key])) {
        delete obj[key];
      }
    }
  }
  return obj;
}

export const downloadBase64File = async () => {
  const linkSource = `data:application/zip;base64,${contentBase64}`;
  const downloadLink = document.createElement('a');
  document.body.appendChild(downloadLink);

  downloadLink.href = linkSource;
  downloadLink.target = '_self';
  downloadLink.download = fileName;
  downloadLink.click();
}

export const FuncConvertirQueryACadenaValues = async () => {
      //OBSERVACIONES:  RECIBE UNA CONSULTA PAGINADA

      let arrCadenasDeConsulta = []

      // definicionOperacion = Es la primer parte, Inicia desde el nombre dado a la consulta,
      let definicionOperacion = queryInGraphQLTag.definitions[0]
  
      // field, Aca ya tiene definido la consulta que va hacer
      let field = definicionOperacion.selectionSet.selections[0]
  
      // selectionSet, Aca contiene el cuerpo de devolucion
      let selectionSet = field.selectionSet
  
      // objects, Aca comienza el cuerpo de objects, el cual tiene los campos de los modelos
      let objects = null
      for (var campo of selectionSet.selections) {
          if (campo.name.value == 'objects') {
              objects = campo
          }
      }
      let FuncCamelTo_snake = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
  
      // selections, Aca comienza en si los propios campos
      let selections = objects.selectionSet.selections
  
      var FuncConvertirCamposAValues = function(arr, padre) {
          for (var campo of arr) {
              // Este es el nombre del campo en SI, convertido en snake_case
              let value_in_snake = FuncCamelTo_snake(campo.name.value)
              if (padre) {value_in_snake = padre + value_in_snake}
              if (campo.selectionSet) { // Y este me dice si tiene hijos o no,
                  let llave_foranea = value_in_snake + '__'
                  FuncConvertirCamposAValues(campo.selectionSet.selections, llave_foranea)
              } else { // si no tan solo es un campo lo envio ya para la cadena
                  arrCadenasDeConsulta.push(value_in_snake)
              }
          }
      }
  
      FuncConvertirCamposAValues(selections)
  
      return arrCadenasDeConsulta.join(', ')
}

export const FuncConvertirValuesQueryEnObj = async () => {
  var snakeToCamel = function (s) {
      return s.replace(/(\_\w)/g, function (w) {return w[1].toUpperCase()})
  }
  var funcCero = function (arrObjs) {
      let clasificacion1 = {}
      for (let obj of arrObjs) {
          if (clasificacion1[obj.id] == null) {
              clasificacion1[obj.id] = []
          }
          for (let key in clasificacion1) {
              if (key == obj.id) {
                  clasificacion1[key].push(obj)
              }
          }
      }
      return clasificacion1
  }
  var funcUno = function (arrObjs) {
      for (let obj of arrObjs) {
          for (let oldKey in obj) {
              if (oldKey.includes('__')) {
                  let keys = oldKey.split('__')
                  for (let i in keys) {
                      if (keys[i].includes('_')) {
                          keys[i] = snakeToCamel(keys[i])
                      }
                  }
                  let newKey = keys.join('__')
                  if (newKey != oldKey) {
                      obj[newKey] = obj[oldKey]
                      delete obj[oldKey]
                  }
              } else {
                  if (oldKey.includes('_')) {
                      obj[snakeToCamel(oldKey)] = obj[oldKey]
                      delete obj[oldKey]
                  }
              }
          }
      }
  }
  var funcDos = function (arrObjs) {
      for (let obj of arrObjs) {
          for (let key in obj) {
              if (key.includes('__')) {
                  let keys = key.split('__')
                  if (keys[1] == 'id') {
                      if (obj[key] == null) {
                          obj[keys[0]] = null
                      } else {
                          if (typeof (obj[keys[0]]) == 'undefined') {
                              obj[keys[0]] = []
                          }
                      }
                  } else {
                      if (typeof (obj[keys[0]]) == 'undefined') {
                          obj[keys[0]] = []
                      }
                  }
              }
          }
      }
  }
  var funcTres = function (arrObjs) {
      for (let obj of arrObjs) {
          for (let key in obj) {
              if (Array.isArray(obj[key])) {
                  let obj2 = {}
                  for (let key2 in obj) {
                      if (key2.includes('__')) {
                          let keys2 = key2.split('__')
                          if (key == keys2[0]) {
                              let keyFinal = key2.replace(`${key}__`, '')
                              obj2[keyFinal] = obj[key2]
                              if (obj[key].length == 0) {
                                  obj[key].push(obj2)
                              }
                              delete obj[key2]
                          }
                      }
                  }
              }
          }
      }
      for (let obj2 of arrObjs) {
          for (let key2 in obj2) {
              if (key2.includes('__')) {
                  delete obj2[key2]
              }
          }
      }
  }
  var funcGlobal = function (arrObjs) {
      funcDos(arrObjs)
      funcTres(arrObjs)
  }
  var funcCuatro = function (arrObjs, obj2) {
      let funcInterna = function(obj) {
          for (let key in obj) {
              if (Array.isArray(obj[key])) {
                  funcGlobal(obj[key])
                  funcCuatro(false, obj[key][0])
              }
          }
      }
      if (arrObjs) {
          for (let obj of arrObjs) {
              funcInterna(obj)
          }
      }
      if (obj2) {
          funcInterna(obj2)
      }
  }
  var funcComparadorDeObjs = function (object1, object2) {
      if (object1 == null && object2 == null) {
          return true
      }
      function isObject(object) {
          return object != null && typeof object === 'object';
      }
      const keys1 = Object.keys(object1);
      const keys2 = Object.keys(object2);
      if (keys1.length !== keys2.length) {
          return false;
      }
      for (const key of keys1) {
          const val1 = object1[key];
          const val2 = object2[key];
          const areObjects = isObject(val1) && isObject(val2);
          if (areObjects && !funcComparadorDeObjs(val1, val2) || !areObjects && val1 !== val2) {
              return false;
          }
      }
      return true;
  }
  var funcSeis = function (obj1, obj2, key, objPadre) {
      if (obj1.id == obj2.id) {
          for (let key in obj2) {
              let value1 = obj1[key]
              let value2 = obj2[key]
              if (!funcComparadorDeObjs(value1, value2)) {
                  if (Array.isArray(value1) && Array.isArray(value2)) {
                      let arrObjsACompararNuevamente = value1.concat(value2)
                      funcCinco(arrObjsACompararNuevamente, key, obj1)
                  }
              }
          }
      } else {
          let yaTieneObj1 = false
          for (let obj of objPadre[key]) {
              yaTieneObj1 = funcComparadorDeObjs(obj, obj1)
              if (yaTieneObj1) {
                  break
              }
          }
          if (yaTieneObj1 == false) {
              objPadre[key].push(obj1)
          }
          let yaTieneObj2 = false
          for (let obj of objPadre[key]) {
              yaTieneObj2 = funcComparadorDeObjs(obj, obj2)
              if (yaTieneObj2) {
                  break
              }
          }
          if (yaTieneObj2 == false) {
              objPadre[key].push(obj2)
          }
      }
  }
  var funcCinco = function (arrObjs, key, objPadre) {
      if (key) {
          if (arrObjs.length > 2) {
              let n = 0
              for (let obj of arrObjs) {
                  n++
                  if (arrObjs[n]) {
                      if (obj.id == arrObjs[n].id) {
                          funcSeis(obj, arrObjs[n], key, objPadre)
                          return
                      }
                  }
              }
          }
      }
      let copiaDelPrimerObj = arrObjs[0]
      for (let i=1; i < arrObjs.length; i++) {
          funcSeis(copiaDelPrimerObj, arrObjs[i], key, objPadre)
      }
      if (key == undefined) {
          return copiaDelPrimerObj
      }
  }
  let clasificacion = funcCero(arrObjs)
  for (let key in clasificacion) {
      funcUno(clasificacion[key])
      funcGlobal(clasificacion[key])
      funcCuatro(clasificacion[key])
      clasificacion[key] = [funcCinco(clasificacion[key])]
  }
  var funcSiete = function(obj) {
      let arrFinal = []
      for (let key in obj) {
          arrFinal = arrFinal.concat(obj[key])
      }
      return arrFinal
  }
  var funcOcho = function(arrObjs, obj2, devolver) {
      let funcInterna = function(obj) {
          for (let key in obj) {
              if (Array.isArray(obj[key])) {
                  if (key.endsWith('s')) {
                      funcOcho(obj[key], false, false)
                  } else {
                      obj[key] = obj[key][0]
                      funcOcho(false, obj[key], false)
                  }
              }
          }
      }
      if (arrObjs) {
          for (let obj of arrObjs) {
              funcInterna(obj)
          }
      }
      if (obj2) {
          funcInterna(obj2)
      }
      if (devolver) {
          return arrObjs
      }
  }
  let arrPreFinal = funcSiete(clasificacion)
  let arrFinal = funcOcho(arrPreFinal, false, true)
  return arrFinal
}

export const validarOperacionDeBaseDeDatos = async () => {
        /**ESTA FUNCION APARTIR DE DOS ARREGLOS DE OBJ,
       * UNO CON LOS DATOS EXISTENTES
       * Y OTRO CON LOS DATOS NUEVOS,
       * VERIFICA CUALES
       * VA A ELIMINAR, CUALES A EDITAR Y CUALES A AGREGAR
       * ((((PARA TESTEAR, parametroComparador=id))))
       * let arrExistente = [{id: 1}, {id: 2}, {id: 3}] //LOS DATOS EXISTENTES
       * let arrNuevo1 = [{id: 1}, {id: 3}] //VIENE A ELIMINAR EL 2 Y A EDITAR EL 1 Y EL 3
       * let arrNuevo2 = [{id: 1}, {id: 2}, {id: 3}] //SOLO VIENE A EDITAR TODOS
       * let arrNuevo3 = [{id: 1}, {id: 2}, {id: 3}, {id: 4}] //VIENE A EDITAR TODOS Y AGREGAR EL 4
       * let arrNuevo4 = [{id: 1}, {id: 3}, {id: 4}] //VIENE A EDITAR EL 1, 3 ELIMINAR EL 2 Y AGREGAR EL 4
       * let arrNuevo5 = [{id: 4}, {id: 5}, {id: 6}] //ELIMINA TODOS LOS DATOS, Y AGREGA UNOS NUEVOS
       */
      //Encuentre valores que estan en los existentes pero no en los nuevos (aEliminar)
      var aEliminar = arrExistente.filter(function(obj, index) {
        return !arrNuevo.some(function(obj2) {
            return obj[parametroComparador] == obj2[parametroComparador];
        });
    });
    //Encuentre valores que estan en los nuevos pero no en los existentes (aAgregar)
    var aAgregar = arrNuevo.filter(function(obj) {
        return !arrExistente.some(function(obj2) {
            return obj[parametroComparador] == obj2[parametroComparador];
        });
    });
    //Encuentre valores que estan en los nuevos Y en los existentes (aEditar)
    var aEditar = []
    arrExistente.forEach(objExiste => {
        arrNuevo.forEach(objNuevo => {
            if (objExiste[parametroComparador] == objNuevo[parametroComparador]) {
                aEditar.push({nuevo: objNuevo, existente: objExiste})
            }
        });
    });
    return {aEliminar, aAgregar, aEditar}
}

export const isOptionSelectableBasedOnSelectedOptions = (selectedOptions, keyToValidate="id") => {
  return (option) => {
    if (selectedOptions?.includes(option[keyToValidate])) {
      return false
    } else {
      return true
    }
  }
}

export function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object' || obj instanceof Date || obj instanceof RegExp || obj instanceof Function || obj instanceof File) {
    return obj;
  }

  if (Array.isArray(obj)) {
    const copy = obj.map(deepCopy);
    return copy;
  }

  const copy = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }
  return copy;
}

export function getStartAndEndOfDay() {
  // Obtiene la fecha actual
  let now = new Date();

  // Establece la hora al comienzo del día (00:00:00)
  let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Establece la hora al final del día (23:59:59)
  let endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  // Convierte las fechas a formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
  let startOfDayISO = startOfDay.toISOString();
  let endOfDayISO = endOfDay.toISOString();

  // Devuelve un array con el inicio y fin del día
  return [startOfDayISO, endOfDayISO];
}

function getStartAndEndOfDayLocal() {
  // Obtiene la fecha actual
  let now = new Date();

  // Establece la hora al comienzo del día (00:00:00)
  let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Establece la hora al final del día (23:59:59)
  let endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  // Función para convertir una fecha y hora a formato ISO 8601 local
  function toLocalISOString(date) {
      let tzoffset = date.getTimezoneOffset() * 60000; // Offset en milisegundos
      let localISOTime = new Date(date - tzoffset).toISOString().slice(0, -1); // Elimina la 'Z'
      return localISOTime;
  }

  // Convierte las fechas a formato ISO 8601 local (YYYY-MM-DDTHH:mm:ss)
  let startOfDayISO = toLocalISOString(startOfDay);
  let endOfDayISO = toLocalISOString(endOfDay);

  // Devuelve un array con el inicio y fin del día
  return [startOfDayISO, endOfDayISO];
}

export function sortObjectsByDate(array) {
  return array.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// export const callApolloMutate = async () => {}

// export const callApolloMutate = async () => {}

// export const callApolloMutate = async () => {}

// export const callApolloMutate = async () => {}

// export const callApolloMutate = async () => {}

// export const callApolloMutate = async () => {}

// export const callApolloMutate = async () => {}

// export const callApolloMutate = async () => {}

// export const callApolloMutate = async () => {}
