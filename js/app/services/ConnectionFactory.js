var ConnectionFactory = (function(){
    const stores = ['business'];
    const version = 4;
    const dbName = 'businessDB';
    var connection = null;
    var close = null;

   return class ConnectionFactory{
        constructor(){

            throw new Error('Não é possível criar instâncias de ConnectionFactory');
        }

        static getConnection(){

            return new Promise((resolve, reject) => {

                let openRequest = window.indexedDB.open(dbName, version);

                openRequest.onupgradeneeded = e => {
                    ConnectionFacoty._createStores(e.target.result);
                }

                openRequest.onsuccess = e => {
                    if(!connection){
                        connection = e.target.result
                        close = connection.close.bind(connection);
                        connection.close = function(){
                            throw new Error('Você não pode fechar diretamente a conexão');
                        }
                    };
                    resolve(connection);
                }

                openRequest.onerror = e => {
                    console.log(e.target.error);
                    reject(e.target.error.name);
                }

            });

        }

        static _createStores(connection){
            stores.forEach(store => {

                if(connection.createObjectStoreNames.contains(store)){
                    connection.deleteObjectStore(store);
                }
                connection.createObjectStore(store, { autoIncrement: true });

            });
        }

        static closeConnection(){
            if(connection){
                close();
                connection = null; 
            }
        }
    }

})();