import {map, isEqual, sortBy} from 'lodash';

export class EasyView {
    constructor(map) {
        this.map = map;
        this.sources = [];
        this.props = {};
    }
    mountSource(source) {
        this.sources.push(source);
        this.updateProps();
    }
    unmountSource(source) {
        let {sources} = this;
        let index = sources.indexOf(source);
        if (index !== -1) {
            sources.splice(index, 1);
            this.updateProps();
        }
    }
    calcProps() {
        let {sources} = this;
        let props = sources.map(extractProps);
        return Object.assign({}, ...props);
    }
    updateProps() {
        let {updateProp} = this;
        if (!this.map.isMounted) {
            return;
        }
        let props = this.calcProps();
        props = map(props, (state, propName) => ({state, propName}));
        sortBy(props, ({state}) => state.transition || 0)
            .forEach(updateProp);
    }
    updateProp = ({state, propName}) => {
        let {props} = this;
        if (!isEqual(state, props[propName])) {
            if (state === undefined) {
                delete props[propName];
            } else {
                props[propName] = state;
            }
            if (state.value !== undefined) {
                this[propName] = state;
            }
        }
    };
    set zoom(valueIgnored) {
        let {constructor:{name}} = this;
        throw new Error(`Non implemented zoom setter for ${name}`);
    }
    set center(valueIgnored) {
        let {constructor:{name}} = this;
        throw new Error(`Non implemented center setter for ${name}`);
    }
    set rotation(valueIgnored) {
        let {constructor:{name}} = this;
        throw new Error(`Non implemented rotation setter for ${name}`);
    }
}

function extractProps(source) {
    if (source instanceof Function) {
        source = source();
    }
    let props = Object.keys(viewProps)
        .map(propName => {
            let value = viewProps[propName](source);
            if (value !== undefined) {
                return {[propName]: value};
            }
            return {};
        });
    return Object.assign({}, ...props);
}

const viewProps = {
    zoom: transitionableProperty('zoom', value => value && Number(value)),
    rotation: transitionableProperty('rotation', value => value && Number(value)),
    center: transitionableProperty('center', value => {
        if (typeof value === 'string') {
            value = value.split(/\s*,\s*/);
        }
        return value && value.map(Number);
    })
};

function transitionableProperty(name, prepareValue) {
    return function(source) {
        if (name in source) {
            let {[name]:value, transition: viewTransition} = source;
            let {[`${name}Transition`]: transition = viewTransition} = source;
            if (transition !== undefined) {
                transition = Number(transition);
            }
            return {
                value: prepareValue(value),
                transition
            };
        }
    };
}
