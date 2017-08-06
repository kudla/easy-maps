import {EasyMap} from './map';
import {EasyView} from './view';

export function verifyEngine(engine) {
    if (typeof engine !== 'object') {
        throw new Error('Engine should be instance of Object');
    }
    let {
        engineName,
        Map
    } = engine;
    if (typeof engineName !== 'string') {
        throw new Error('Engine should have engineName property of type string');
    }
    if (!EasyMap.isPrototypeOf(Map)) {
        throw new Error('Map should extend easy-map Map');
    }
    if (!EasyView.isPrototypeOf(engine.View)) {
        throw new Error('View should extend easy-map View');
    }
}
