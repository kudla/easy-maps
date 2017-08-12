export class EasyMap {
    mount(targetIgnored) {
        let {constructor:{name}} = this;
        throw new Error(`Non implemented mount method for ${name}`);
    }
    get isMounted() {
        let {constructor:{name}} = this;
        throw new Error(`Non implemented isMounted getter for ${name}`);
    }
}
