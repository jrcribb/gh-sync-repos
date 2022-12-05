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
                    console.log(`Workflow ID: ${id}`);
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
            //console.log(list)
            //console.log(stderr)
            // let i = 0
            // list.split(',').forEach((bundle)=>{
            //     id = bundle.substring(14,bundle.length-2)
            //     console.log(`Workflow ID: ${id}`)
            //     exec(`gh api repos/${user_}/${repo_}/actions/runs/${id} -X DELETE `,(error, stdout, stderr)=>{
            //         if (error) {
            //             console.error(" Error:",`Eliminación fallida: ${error.message}`);
            //         } else {
            //              console.log(" Status:"," Eliminado");
            //         }

            //     })
            // })
            if (error) {
                console.error(
                    " Error:",
                    `Sincronización fallida: ${error.message}`
                );
                // } else {
                //     console.log(" Status:"," Sincronizado");
            }
        }
    );
};
removeWorkflows("jrcribb", "InvokeAI");
