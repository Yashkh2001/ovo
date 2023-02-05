import uniqueId from 'lodash/uniqueId';

import emitter from '../../emitter';

import { DEFAULT_DURATION, HIDE, SHOW } from './constants';
import * as types from './types';

export const hideAlert= (id) => emitter.emit(HIDE,id)

export const showAlert = ({type,message,duration=DEFAULT_DURATION}) =>{
    const id=uniqueId()

    emitter.emit(SHOW, {
        id,
        type,
        message
    })

    if(duration > 0){
        setTimeout(() => {
            hideAlert(id)
        },duration );
       
    }
}

export default emitter;