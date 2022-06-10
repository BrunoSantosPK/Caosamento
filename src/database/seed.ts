import path from "path";
import { config } from "dotenv";
config({ path: path.join(__dirname, "..", "config", ".env") });

async function seed() {
    try {
        // Cria usuário padrão
    } catch(error: any) {
        return error;
    }
}

seed().then(result => {
    console.log("Processo de seed finalizado.");
}).catch(error => {
    console.log("Um erro ocorreu ao realizar o seed.");
    console.log(error);
});