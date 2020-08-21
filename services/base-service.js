const fs = require('fs');
const { resolve } = require('path');
const { rejects } = require('assert');

module.exports = class Service {
    constructor(model, dbPath){
        this.model = model;
        this.dbPath = dbPath;
    }

    async findAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.dbPath, 'utf8', async (err, data) => {
                if(err){
                    if(err.code = 'ENOENT'){
                        await this.saveAll([]);
                        return resolve([]);    
                    };
                    return reject(err);
                };           
                const items = JSON.parse(data);
                resolve(items);
            });
        });
    }

    async add(item) {
        const allItems = await this.findAll();
        let lastItemId = 0;
        if(allItems.length > 0 ){
            const lastItem = allItems[allItems.length -1];
            lastItemId = lastItem.id;
        }
        item.id = lastItemId + 1;
        allItems.push(item);
        await this.saveAll(allItems);
        return item;
    }

    async delete(itemId) {
        const allItems = await this.findAll();
        const itemIndex = allItems.findIndex( i => i.id ==itemId);
        if(itemIndex < 0) return;
        allItems.splice(itemIndex, 1);
        await this.saveAll(allItems);
        return true;
    }

    async find(itemId) {
        const allItems = await this.findAll();
        return allItems.find(i => i.id == itemId);
    }

    async update(item){
        const allItems = await this.findAll();
        const itemIndex = allItems.findIndex( i => i.id ==item.id);
        allItems[itemIndex] = item;
        return await this.saveAll(allItems);

    }

    async saveAll(items) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.dbPath, JSON.stringify(items), (err, file) => {
                if(err) return false;
                resolve(true)
            })
        })
    }
}