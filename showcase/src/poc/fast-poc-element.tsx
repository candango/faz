
import { FazElement } from "../../../src/element";

// Uma versão do FazElement que renderiza SINCRONAMENTE pra matar a expansão
export class FastPocElement extends FazElement {
    // A classe base agora já é síncrona por padrão, mas mantemos aqui
    // para garantir o comportamento desejado na POC.
}
