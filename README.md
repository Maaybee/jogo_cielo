# Inteli - Instituto de Tecnologia e Liderança 

<p align="center">
<a href= "https://www.inteli.edu.br/"><img src="/documents/assets/inteli.png" alt="Inteli - Instituto de Tecnologia e Liderança" border="0" width=40% height=40%></a>
</p>

<br>

# Nome do projeto

Conexão Cielo 

## Nome do grupo

Blue Codes 

## 👨‍🎓 Integrantes: 
- <a href="https://www.linkedin.com/in/bruno-calenda-45607b3aa/">Bruno Calenda Abreu</a>
- <a href="https://www.linkedin.com/in/enzo-ferreira-de-andrade-88566829a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">Enzo Ferreira de Andrade</a>
- <a href="https://www.linkedin.com/in/guilherme-ludovico-fraga-0625b425a/">Guilherme Ludovico Fraga</a> 
- <a href="https://www.linkedin.com/in/laura-fontoura-tosar-2210593b0?utm_source=share_via&utm_content=profile&utm_medium=member_ios">Laura Fontoura Tosar</a> 
- <a href="https://www.linkedin.com/in/lucas-delmirio-da-silva-26b245359/">Lucas Delmirio da Silva</a>
- <a href="https://www.linkedin.com/in/marco-tulio-vieira-teixeira-a229a727b/">Marco Túlio Vieira Teixeira</a> 
- <a href="https://www.linkedin.com/in/matteus-haikal-86b2bb39b">Matteus Ferreira Haikal Giglio</a>
- <a href="https://www.linkedin.com/in/stephany-marq">Stephany Marques dos Santos</a>

## 👩‍🏫 Professores:
### Orientador(a) 
- <a href="https://www.linkedin.com/in/vanunes/">Vanessa Tavares Nunes</a>
### Instrutores
- <a href="https://www.linkedin.com/in/anacristinadossantos/">Ana Cristina dos Santos</a>
- <a href="https://www.linkedin.com/in/cristiano-benites-ph-d-687647a8/">Cristiano da Silva Benites</a>
- <a href="https://www.linkedin.com/in/fabiana-martins-de-oliveira-8993b0b2/">Fabiana Martins de Oliveira</a> 
- <a href="https://www.linkedin.com/in/geraldo-magela-severino-vasconcelos-22b1b220/">Geraldo Magela Severino Vasconcelos</a> 
- <a href="https://www.linkedin.com/in/pedroteberga/">Pedro Marins Freire Teberga</a> 


## 📜 Descrição

O projeto, desenvolvido pela equipe Blue Codes durante o Módulo 1 do Inteli em parceria com a Cielo, busca solucionar um grande desafio logístico e educacional na capacitação de novos Gerentes de Negócios (GNs). Devido à forte dispersão geográfica da força de vendas da empresa pelo Brasil, treinamentos práticos presenciais acabam sendo inacessíveis para diversos colaboradores que não atuam nos grandes centros urbanos. Isso pode gerar uma desigualdade na fixação do conhecimento e certa insegurança no momento da negociação no mundo real.

Para contornar essa barreira e democratizar o aprendizado, foi desenvolvido um Simulador Digital de Vendas, o Conexão Cielo. A solução consiste em um jogo educacional web-based no formato de Visual Novel. Por ser acessível diretamente via navegadores comuns, a plataforma elimina a necessidade de instalações complexas, garantindo que qualquer colaborador com acesso à internet possa treinar.

No jogo, o usuário assume, em primeira pessoa, o papel de um GN da Cielo recém-contratado. Guiado inicialmente pela assistente virtual Cielita, o jogador explora um mapa urbano interativo e visita diferentes estabelecimentos comerciais (como padaria, quitanda, restaurante e posto de gasolina). A mecânica central baseia-se na simulação de conversas: o vendedor interage com NPCs de diferentes perfis, precisando analisar o contexto, apresentar produtos adequados do portfólio da empresa e contornar objeções de venda.

A cada etapa do diálogo, o jogador escolhe entre diferentes respostas. O desempenho é medido por meio de uma Barra de Satisfação do Cliente. Escolhas estratégicas e assertivas aumentam a confiança do lojista e encaminham o fechamento do negócio; respostas inadequadas geram insatisfação e podem fazer o jogador perder a venda. Vendas bem-sucedidas geram pontos de Reputação, que servem para desbloquear fases gradativamente mais difíceis.

O grande valor da solução está em oferecer um ambiente digital seguro onde a força de vendas pode errar, testar abordagens e absorver conhecimentos teóricos de forma totalmente imersiva. Com isso, o projeto garante um treinamento padronizado, engajador e altamente escalável, focado em aprimorar a inteligência emocional do vendedor e impulsionar a performance comercial em campo de maneira autônoma.

<b> Link para o jogo no Github Pages </b>

<a href="https://maaybee.github.io/jogo_cielo/">Clique aqui e jogue</a> 


## 📁 Estrutura de pastas

Dentre os arquivos e pastas presentes na raiz do projeto, definem-se:

- <b>documents</b>: aqui estão todos os documentos do projeto.
  - <b>assets</b>: arquivos e imagens de apoio utilizados exclusivamente na documentação.
  - <b>other</b>: Documentos complementares das sprints.
  - <b>gdd.md</b>: Game Development Document (GDD) detalhando o escopo e design do projeto.
<br>
- <b>public</b>: pasta pública que concentra os recursos estáticos e o código da aplicação.
  - <b>assets</b>: aqui estão os arquivos relacionados a elementos não-estruturados deste repositório, como imagens e áudios.
    - <b>backgrounds</b>: Imagens de fundo para os diferentes cenários do simulador (padaria, posto de gasolina, quitanda, restaurante, etc.).
    - <b>characters</b>: Sprites e expressões dos personagens (gerentes, padeiro, líder Cielo, etc.).
    - <b>fonts</b>: Fontes tipográficas customizadas importadas para o jogo.
    - <b>levels</b>: Elementos de interface e modais específicos das fases.
    - <b>logos</b>: Logotipos utilizados na interface, incluindo a marca da Cielo e do Inteli.
    - <b>sounds</b>: Diretório reservado para arquivos de áudio (efeitos sonoros e trilhas).
  - <b>src</b>: Contém todos os arquivos JavaScript, incluindo os scripts individuais de cada Cena do Phaser e os gerenciadores de dados, cookies e diálogos.
    
<br>

- <b>.gitlab-ci.yml</b>: arquivo de configuração para a esteira de integração e entrega contínua (CI/CD) no GitLab.
<br>
- <b>index.html</b>: arquivo principal de estrutura web onde o canvas do jogo é renderizado.
<br>
- <b>README.md</b>: arquivo que serve como guia e explicação geral sobre o projeto e o jogo (o mesmo que você está lendo agora).

## 🔧 Como executar o código

Como o Conexão Cielo foi desenvolvido com foco na acessibilidade e facilidade de uso, ele está hospedado em nuvem (via Pages). Isso significa que não é necessário instalar nenhum software, baixar arquivos de código ou configurar ambientes de desenvolvimento na sua máquina. O jogo funciona de forma fluida e direta no seu navegador de internet.

1. Pré-requisitos

Para garantir a melhor experiência, certifique-se de ter:

- Um dispositivo com acesso à internet (computador ou notebook).

- Um navegador web moderno e atualizado (recomendamos as versões mais recentes do Google Chrome, Mozilla Firefox, Microsoft Edge ou Safari).

2. Passo a passo para jogar
-Acesse o link oficial: Abra o seu navegador e acesse o endereço onde o jogo está hospedado: [https://maaybee.github.io/jogo_cielo/]

- Aguarde o carregamento: A tela inicial do jogo será carregada automaticamente. Os assets (imagens em pixel art e áudios) são leves, mas podem levar alguns segundos para carregar dependendo da sua conexão.

- Inicie a simulação: Assim que a tela inicial aparecer, clique no botão para começar a jogar e ser recepcionado pela assistente virtual Cielita.

- Ativação do Áudio: Atenção! Devido às políticas de segurança padrão dos navegadores atuais, a trilha sonora e os efeitos de som do jogo só serão ativados após o seu primeiro clique na interface.


## 🗃 Histórico de lançamentos

- v1.0 - 09/04/2025 - Sprint 5: Nesta versão, focamos na revisão do MVP após os playtests. Implementamos a tela de "Como Jogar", adicionamos modais de confirmação de entrada e saída das fases para evitar cliques acidentais, aprimoramos o tutorial dinâmico com a Cielita guiando o jogador pelo mapa e refinamos os feedbacks visuais de vitória e derrota.
<br>
- v0.4 - 27/03/2025 - Sprint 4: Nesta versão, finalizamos o Produto Mínimo Viável (MVP). Integramos as quatro fases completas (Padaria, Quitanda, Restaurante e Posto de Gasolina), implementamos a mecânica de expressões faciais dos NPCs como feedback, adicionamos o sistema de salvamento de progresso e a cena final de conclusão do treinamento com a entrega do certificado.
<br>
- v0.3 - 13/03/2025 - Sprint 3: Nesta versão, expandimos o mapa adicionando os novos cenários da Quitanda e do Posto de Gasolina. Concluímos também a lógica definitiva da Barra de Satisfação do cliente e aplicamos correções e melhorias no fluxo do sistema de diálogos ramificados.
<br>
- v0.2 - 27/02/2025 - Sprint 2: Nesta versão, transformamos a estrutura inicial em uma experiência jogável. Implementamos o sistema de transição de cenas, liberamos o primeiro estabelecimento funcional (Padaria) e introduzimos o sistema inicial de diálogos adaptativos.
<br>
- v0.1 - 13/02/2025 - Sprint 1: Nesta versão, entregamos a estrutura base do projeto. Desenvolvemos o fluxo principal de navegação contemplando a tela de início, a introdução, o mapa urbano interativo e a tela de encerramento.

## 📋 Licença/License

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1">

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1">

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://git.inteli.edu.br/graduacao/2026-1a/t28/g01">Conexão Cielo</a> by  <a href="https://www.linkedin.com/in/bruno-calenda-45607b3aa/">Bruno Calenda Abreu</a>, <a href="https://www.linkedin.com/in/enzo-ferreira-de-andrade-88566829a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">Enzo Ferreira de Andrade</a>, <a href="https://www.linkedin.com/in/guilherme-ludovico-fraga-0625b425a/">Guilherme Ludovico Fraga</a>, <a href="https://www.linkedin.com/in/laura-fontoura-tosar-2210593b0?utm_source=share_via&utm_content=profile&utm_medium=member_ios">Laura Fontoura Tosar</a>, <a href="https://www.linkedin.com/in/lucas-delmirio-da-silva-26b245359/">Lucas Delmirio da Silva</a>, <a href="https://www.linkedin.com/in/marco-tulio-vieira-teixeira-a229a727b/">Marco Túlio Vieira Teixeira</a>, <a href="https://www.linkedin.com/in/matteus-haikal-86b2bb39b">Matteus Ferreira Haikal Giglio</a>, <a href="https://www.linkedin.com/in/stephany-marq">Stephany Marques dos Santos</a>
 is licensed under <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International</a>.</p>


