const { exec } = require("child_process");

const removeWorkflows = (user_, repo_) => {
    exec(
        `gh run list -R https://github.com/${user_}/${repo_}`,
        (error, stdout, stderr) => {
            const list = stdout;
            list.split("\n").forEach((fila) => {
                let col = -1;
                let id = 0;
                if (fila.length > 0) {
                    for (i = 0; i <= 5; i++) {
                        col = fila.indexOf("\t", col + 1);
                    }
                    id = fila.substring(col + 1, col + 11);
                    //console.log(`Workflow ID: ${id}`);
                    exec(
                        `gh api repos/${user_}/${repo_}/actions/runs/${id} -X DELETE `,
                        (error, stdout, stderr) => {
                            // if (error) {
                            //     console.error(
                            //         " Error:",
                            //         `Eliminación fallida: ${error.message}`
                            //     );
                            // } else {
                            //     console.log(" Status:", " Eliminado");
                            // }
                        }
                    );
                }
            });
            // if (error) {
            //     console.error(
            //         " Error:",
            //         `Sincronización fallida: ${error.message}`
            //     );
            // }
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
                            exec(
                                `gh repo sync --force ${ghUser}/${name}`,
                                (error, stdout, stderr) => {
                                    console.log("REPOSITORY NAME: ",html_url);
                                    console.log("Description: ",description ? description : "Sin descripción");
                                    removeWorkflows(ghUser, name);
                                    if (error) {
                                        console.error(" Error:",`Sincronización fallida: ${error.message}`);
                                    } else {
                                        console.log(" Status:"," Sincronizado");
                                    }
                                }
                            );
                        } catch (error) {
                            console.error(" Error:","Error de s.o.");
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
