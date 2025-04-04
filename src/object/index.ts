import { isObject, isArray, isEmptyObject } from '../helper';

import { RecordObj } from '../types';

export type FunctionInterface = ( ...args: any[] ) => any;

export type CallbackInterface<R = any> = ( ...arg: any[] ) => R

/**
 * 深度遍历对象, 将多层对象扁平化
 * @param obj 遍历对象
 * @param fn 每一个key执行的方法
 * @returns void
 * **/

export function objectEach ( obj: RecordObj, fn: FunctionInterface ): void {


  // 如果不是对象直接返回

  if ( !isObject ( obj ) ) {

    throw Error ( 'Parameter must be object' );

  }

  const keys: string[] = Object.keys ( obj );

  keys.forEach ( key => {

    const value = obj[ key ];

    if ( isObject ( value ) && value ) {

      objectEach ( value, fn );

    } else {

      fn ( key, value );

    }

  } );

}



/**
 * 对象深拷贝
 * @param target 需要拷贝的对象
 * @returns newTarget object
 * */

export function objectClone ( target:RecordObj ): RecordObj {

  const result: Record<any, any> = target.constructor === Array ? [] : {};

  for ( let key in target ) {

    if ( target.hasOwnProperty ( key ) ) {

      if ( target[ key ] && isObject ( target[ key ] ) ) {

        result[ key ] = target[ key ].constructor === Array ? [] : {};

        result[ key ] = objectClone ( target[ key ] );

      } else {

        result[ key ] = target[ key ];

      }

    }

  }

  return result;

}


/**
* 对象比较(不比较原型链的属性)
* @param original 原始对象
* @param target 目标对象
* @returns new diff object
 * **/

export function objectDiff ( original: Record<string, any>, target: RecordObj ): RecordObj {

  const result: RecordObj = {};

  const targetKeys: string[] = Object.keys ( target );

  targetKeys.forEach ( key => {

    // 新增的属性

    if ( !original[ key ] ) {

      result[ key ] = target[ key ];

      return;

    }

    // 属性是个对象

    if ( isObject ( target[ key ] ) ) {

      let values = objectDiff ( original[ key ] || {}, target[ key ] );

      if ( !isEmptyObject ( values ) ) {

        result[ key ] = values;

      }

      return;

    }

    // 属性是个数组

    if ( isArray ( target[ key ] ) ) {

      result[ key ] = target[ key ];

      return;

    }

    // 属性值更新了

    if ( original[ key ] !== target[ key ] ) {

      result[ key ] = target[ key ];

    }

  } );

  return result;

}

/**
 * 将对象转为字符串
 * @param obj 需要转化的对象
 * @returns query string
*/

export function objectToQueryString ( obj: RecordObj ): string {

  return obj
    ? Object.entries ( obj ).reduce ( ( queryString, [ key, val ] ) => {

      let resultStr = queryString || '';

      const symbol = resultStr.length === 0 ? '' : '&';

      if ( isObject ( val ) || isArray ( val ) ) {

        resultStr += val ? `${symbol}${key}=${JSON.stringify ( val )}` : '';

      } else {

        resultStr += val ? `${symbol}${key}=${val}` : '';

      }

      return resultStr;

    }, '' )
    : '';

}

/**
  *  将对象转化为key+value 字符串
  * @param obj 需要转化的object
  * @param separator 分隔符号
  * @param callback 自定义处理回调函数
  * @returns key + value string
  */

export function objectToString ( obj: RecordObj, separator?: string, callback?:CallbackInterface ): string {

  let queryStr = '';

  for ( const [ key, value ] of Object.entries ( obj ) ) {

    if ( callback ) {

      callback ( key, value );

    } else {

      queryStr += `${key}:${value}${separator || ';'}`;

    }

  }

  return queryStr;

}


/**
 * @desc 初始化对象属性值
 * @param { Object } obj 需要初始化对象的值
 * */

export function resetObjectValue<T=any> ( obj ): T {

  for ( const key in obj ) {

    const currentVal = obj[ key ];

    if ( isObject ( currentVal ) ) {

      obj[ key ] = resetObjectValue ( currentVal );

    }

    if ( isArray ( currentVal ) ) {

      obj[ key ] = [];

    }

    obj[ key ] = null;

  }

  return obj;

}