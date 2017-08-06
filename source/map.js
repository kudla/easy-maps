export class EasyMap {
    mount(targetIgnored) {
        let {constructor:{name}} = this;
        throw new Error(`Implement mount method for ${name}`);
    }
}
