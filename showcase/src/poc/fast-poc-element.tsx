
import { FazElement } from "../../../src/element";

// Uma versão do FazElement que renderiza SINCRONAMENTE pra matar a expansão
export class FastPocElement extends FazElement {
    connectedCallback() {
        if (this.comment){
            this.before(this.comment);
        }
        // SEM Promise.resolve().then()! 
        // Renderizamos IMEDIATAMENTE no momento da conexão.
        if (this.loading()) {
            this.render();
        }
        this.setConnected(true);
        this.setLoading(false);
    }
}
