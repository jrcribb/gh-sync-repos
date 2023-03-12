const { exec } = require("child_process");

const removeWorkflows = (user_, repo_) => {
    exec(`gh workflow -R https://github.com/${user_}/${repo_} list`,
        (error, stdout, stderr) => {
            const list = stdout;
            list.split("\n").forEach((fila) => {
                let col = -1;
                let id = 0;
                if (fila.length > 0) {
                    id = fila.substring(fila.length - 8);
                    exec(`gh workflow -R https://github.com/${user_}/${repo_} disable ${id}`,
                        (error, stdout, stderr) => {
                            if (error) {
                                console.error(`Error: Eliminación fallida: ${error.message}`);
                            } else {
                                console.log(" Status: Eliminado");
                            }
                        }
                    );
                }
            });
            if (error) {
                    console.error(" Error:",`Sincronización fallida: ${error.message}`
                );
            } else {
                console.log(" Status:"," Sincronizado");
            }
        }
    );
};

const syncRepos = async () => {
    console.log("Actualizando");
    let ghUser = "jrcribb";
    let page = 1;
    let morePages = true;
    let syncStatus = "";
    do {
        try {
            const urlGH = `https://api.github.com/users/${ghUser}/repos?page=${page}`;
            const resp = await fetch(urlGH);
            const respjson = await resp.json();
            if (respjson.length > 0) {
                respjson.forEach((rowJson) => {
                    const { html_url, description, name, fork } = rowJson;
                    if (fork) {
                        try {
                            exec(`gh repo sync --force ${ghUser}/${name}`,
                                (error, stdout, stderr) => {
                                    console.log("REPOSITORY NAME: ",html_url);
                                    console.log("Description: ",description ? description : "Sin descripción");
                                    removeWorkflows(ghUser, name);
                                    if (error) {
                                        console.error(`Error: Sincronización fallida: ${error.message}`);
                                    } else {
                                        console.log(" Status: Sincronizado");
                                    }
                                }
                            );
                        } catch (error) {
                            console.error(" Error: Error de s.o.");
                        }
                    }
                });
                page++;
            } else {
                morePages = false;
            }
        } catch (error) {
            morePages = false;
            console.error(error);
            return;
        }
    } while (morePages);
};
syncRepos();
