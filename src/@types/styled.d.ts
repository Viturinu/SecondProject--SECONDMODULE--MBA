import "styled-components";
import { defaultTheme } from "../styles/themes/default";

type ThemeType = typeof defaultTheme;

declare module "styled-components" { //sobreescreveno com mais informações a tipagem da biblioteca styled-components, ou seja, sempre que eu importar de algum lugar, agora vai ter o que teria naturalmente as coisas que tinham no styled-components mais as coisas que declarei, que neste caso abaixo é o ThemeType. Isso serve para ajudar na inteligencia do autocomplete de algumas partes do codigo que usem ThemeType (uma das coias, obviamente)
    export interface DefaultTheme extends ThemeType { }
}