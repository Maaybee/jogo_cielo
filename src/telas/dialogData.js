// ==========================================================================
// DIÁLOGO DA PADARIA (OSWALDO)
// ==========================================================================
export const OSWALDO_DIALOG = {
  // Define as configurações de pontuação inicial e os limites de vitória para o cenário
  config: {
    initialScore: 70,
    scoreToWin: 50,
  },

  // Inicia a primeira rodada focando na dor do cliente sobre taxas confusas e falta de proximidade
  step1: {
    npcText: [
      `"Bom dia! Aceita um pão de queijo? Olha, vou ser muito sincero: eu não estava querendo trocar de maquininha."`,
      `"O custo de produção subiu e o banco me manda um extrato que eu não entendo nada. Acabo me sentindo só mais um número lá para eles. O que a Cielo faria diferente por uma padaria como a minha?"`
    ],
    playerOptions: [
      {
        id: "step1_a",
        text: "O principal diferencial que trago hoje é uma redução agressiva das suas taxas. A Cielo consegue cobrir a oferta do seu banco atual, garantindo que o custo de cada pãozinho seja o menor do mercado.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: "step1_a_response",
      },
      {
        id: "step1_b",
        text: "Se o que falta é a garantia de não ser apenas um número, eu tenho a solução. Além do aplicativo Cielo Gestão para um extrato mais claro, o diferencial é me ter como seu Gerente de Negócios.",
        isCorrect: true,
        satisfaction: +20,
        nextDialog: "step1_b_response",
      },
      {
        id: "step1_c",
        text: "Para o seu comércio, a solução é a ferramenta Cielo Farol. Com ela, nós analisamos o perfil do seu consumidor e comparamos suas vendas com o mercado da região para alavancar o seu faturamento diário.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: "step1_c_response",
      },
    ],
  },

  // Gerencia a resposta positiva quando o jogador demonstra empatia com a organização do cliente
  step1_b_response: {
    npcText: `"Espera, você quer dizer que não vou precisar falar com máquina no telefone? Ter um gerente de carne e osso cuidando da minha operação e um aplicativo que eu entenda já muda bastante a conversa."`,
    playerOptions: [
      {
        id: "step1_b_next",
        text: "[Continuar ouvindo]",
        isCorrect: true,
        satisfaction: 0,
        nextDialog: "step2",
      },
    ],
  },

  // Trata a reação de insegurança do NPC quando confrontado com o tamanho da empresa
  step1_a_response: {
    npcText: `"Mas, se o banco já me manda um extrato que eu não entendo, do que adianta me prometer a uma taxa menor se eu não consigo conferir se estão cobrando certo? Vou continuar sendo enrolado, só que por uma taxa diferente."`,
    playerOptions: [
      {
        id: "step1_a_recovery",
        text: "Tem razão, de nada adianta taxa baixa sem transparência. Esqueça o preço por um momento. Como você controla as suas vendas para ter certeza do lucro final?",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: "step2",
      },
      {
        id: "step1_a_fatal",
        text: "Mas, matematicamente a redução das taxas impacta diretamente no seu lucro líquido no final do mês.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step2",
      },
    ],
  },

  // Lida com o desvio de assunto sobre sinal e tenta retornar o foco para a dor financeira
  step1_c_response: {
    npcText: `"Isso de comparar dados com os outros é muito interessante, mas não resolve a minha dor de cabeça de hoje. Meu problema é entender o que sobra no fim do dia e ter com quem falar."`,
    playerOptions: [
      {
        id: "step1_c_recovery",
        text: "Fui um passo adiante, peço desculpas. Vamos focar no básico bem feito. Como você controla as suas vendas para ter certeza do lucro final?",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: "step2",
      },
      {
        id: "step1_c_fatal",
        text: "Mas o crescimento das vendas através de análise de dados é o que garante o futuro do seu negócio.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step2",
      },
    ],
  },

  // Apresenta o dilema do fluxo de caixa e o prazo de recebimento das vendas no crédito
  step2: {
    npcText: [
      `"A parte do extrato a gente organiza. Meu sufoco mesmo é o prazo. A freguesia adora pagar no crédito, mas o banco segura meu dinheiro por trinta dias."`,
      `"O fornecedor da farinha bate aqui todo dia cedo! Se não pagar à vista, a produção para."`
    ],
    playerOptions: [
      {
        id: "step2_a",
        text: "Se o prazo do crédito prejudica o fluxo do seu caixa diário, a melhor solução é desabilitar essa função. Assim, operamos apenas com débito e Pix, garantindo o dinheiro da farinha sem custos adicionais.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: "step2_a_response",
      },
      {
        id: "step2_b",
        text: "Para ajudar no custo da farinha, eu posso zerar a sua taxa de antecipação. Com taxas reduzidas, a padaria economiza um valor expressivo no mês, criando um caixa extra para negociar com os fornecedores.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: "step2_b_response",
      },
      {
        id: "step2_c",
        text: 'A padaria não faz milagre sem fluxo de caixa. Podemos habilitar a função de recebimento no mesmo dia. O cliente passa no crédito, e o dinheiro cai direto no Pix, garantindo o capital para pagar a farinha.',
        isCorrect: true,
        satisfaction: +25,
        nextDialog: "step2_c_response",
      },
    ],
  },

  // Valida a aceitação da solução "Tá na Conta" para o pagamento imediato de fornecedores
  step2_c_response: {
    npcText: `"No mesmo dia? O cliente passa o crédito à tarde e no fim do expediente o dinheiro já está livre na conta para eu pagar a farinha do dia seguinte? Nossa, isso seria a salvação do meu caixa!"`,
    playerOptions: [
      {
        id: "step2_c_next",
        text: "[Apresentar a solução final]",
        isCorrect: true,
        satisfaction: 0,
        nextDialog: "step3",
      },
    ],
  },

  // Gerencia a frustração do NPC com conselhos de planejamento financeiro irreais para o giro diário
  step2_a_response: {
    npcText: `"Desligar o crédito? Os clientes que levam grandes encomendas no fim de semana passam tudo no cartão. Se eu tirar o crédito, perco a venda na hora para a concorrência."`,
    playerOptions: [
      {
        id: "step2_a_fatal",
        text: "Mas é um sacrifício momentâneo muito necessário para garantir o dinheiro à vista e não quebrar o seu negócio!",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step3",
      },
      {
        id: "step2_a_recovery",
        text: "Perder venda está fora de cogitação, a sugestão foi ruim. E se mantivermos o crédito, mas com o recebimento antecipado das vendas caindo direto na sua conta?",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: "step3",
      },
    ],
  },

  // Trata a objeção de perder vendas ao sugerir a desativação da função crédito
  step2_b_response: {
    npcText: `"Economizar no fim do mês é ótimo, mas o fornecedor da farinha não quer saber de caixa extra daqui a trinta dias. Ele está na minha porta amanhã às seis da manhã. Taxa zero não me dá o dinheiro hoje."`,
    playerOptions: [
      {
        id: "step2_b_recovery",
        text: "A leitura foi falha, o problema não é custo, é fluxo de caixa imediato. O que acha de recebermos os valores das suas próprias vendas de crédito no mesmo dia via Pix?",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: "step3",
      },
      {
        id: "step2_b_fatal",
        text: "Mas todo centavo economizado em taxas ajuda a compor o balanço financeiro da padaria.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step3",
      },
    ],
  },

  // Aborda o medo final do suporte técnico e a importância do atendimento humanizado no domingo
  step3: {
    npcText: `"Ter o dinheiro no mesmo dia é o cenário ideal. Mas vou confessar um receio: tenho medo de trocar e ter dor de cabeça. Demora dias para instalar. E se a máquina parar num domingo com a fila dobrando a esquina, vou ter que ligar para central?"`,
    playerOptions: [
      {
        id: "step3_a",
        text: "A transição é muito rápida e o nosso suporte técnico está disponível vinte e quatro horas por dia. Basta ligar para a nossa central e abrir um chamado urgente, que nossa equipe técnica resolverá o problema prontamente.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: "step3_a_response",
      },
      {
        id: "step3_b",
        text: "Pode ficar absolutamente tranquilo quanto à troca. Para compensar qualquer transtorno de adaptação, eu ofereço a isenção total do aluguel da máquina e mantenho suas taxas congeladas por um ano inteiro.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: "step3_b_response",
      },
      {
        id: "step3_c",
        text: "Não há espera, eu ando com os equipamentos no carro e instalo a máquina agora mesmo. E sobre o domingo, eu sou o seu Gerente de Negócios. Deu problema na fila, o senhor manda mensagem direto no meu WhatsApp.",
        isCorrect: true,
        satisfaction: +25,
        nextDialog: "step3_c_response",
      },
    ],
  },

  // Conclui a oferta de valor através da parceria direta e suporte via WhatsApp
  step3_c_response: {
    npcText: `"Espera... você instala agora mesmo? E se der problema domingo de manhã, eu mando mensagem e você mesmo resolve? Ter um parceiro para assumir a bronca comigo assim muda tudo!"`,
    playerOptions: [
      {
        id: "step3_c_next",
        text: "[Finalizar negociação]",
        isCorrect: true,
        satisfaction: 0,
        nextDialog: "check_victory",
      },
    ],
  },

  // Trata a reação à opção errada A do step3
  step3_a_response: {
    npcText: `"Ligar para central, digitar protocolo e ouvir gravação enquanto a fila do balcão cresce? Era exatamente disso que eu estava querendo fugir. Não posso depender de atendimento automático no domingo de manhã."`,
    playerOptions: [
      {
        id: "step3_a_recovery",
        text: "O balcão não espera, concordo. Além da central, o diferencial é ter o meu contato direto para emergências. Ter um gerente à disposição resolve esse medo?",
        isCorrect: true,
        satisfaction: +15,
        nextDialog: "check_victory",
      },
      {
        id: "step3_a_fatal",
        text: "Mas a nossa central possui o tempo de resposta mais rápido do mercado.",
        isCorrect: false,
        satisfaction: -30,
        nextDialog: "check_victory",
      },
    ],
  },

  // Trata a percepção do cliente de que tecnologia visual não resolve problemas operacionais urgentes
  step3_b_response: {
    npcText: `"Isenção de aluguel é bom para o bolso, mas quando a máquina trava aqui no balcão de manhã cedo com a fila cheia, máquina de graça não destrava a minha fila. Eu preciso é de ação rápida e suporte real."`,
    playerOptions: [
      {
        id: "step3_b_recovery",
        text: "Com certeza, isenção não atende balcão. Por isso a responsabilidade é minha. Sou seu Gerente de Negócios e estarei à disposição para qualquer emergência. Fechado?",
        isCorrect: true,
        satisfaction: +15,
        nextDialog: "check_victory",
      },
      {
        id: "step3_b_fatal",
        text: "Mas ter um equipamento de ponta sem custo mensal já reduz bastante o risco financeiro da operação.",
        isCorrect: false,
        satisfaction: -30,
        nextDialog: "check_victory",
      },
    ],
  },

  // Exibe a mensagem de vitória e o bônus final concedido pelo NPC
  final_success: {
    npcText: `"Pode pegar a maquininha no carro então. Você resolveu o fluxo da farinha, me apresentou um aplicativo claro e ainda vai ser meu parceiro direto. Vamos fechar negócio! Gostei de você, acho que a minha amiga Julie da Quitanda adoraria te conhecer."`,
    isEndDialog: true,
    isSuccess: true,
  },

  // Exibe a mensagem de derrota e a justificativa do cliente para não mudar de serviço
  final_failure: {
    npcText: `"Agradeço a apresentação, você é um ótimo profissional. Mas para trocar, enfrentar burocracia, depender de central e ouvir papo de taxa, eu prefiro não arriscar a operação da padaria. Muito obrigado pela visita. Pode tentar novamente outro dia."`,
    isEndDialog: true,
    isSuccess: false,
  },
};

// ============================================================================
// DIÁLOGO DA QUITANDA (JULIE)
// ============================================================================
export const JULIE_DIALOG = {
  // Configura os parâmetros de dificuldade específicos para o cenário da quitanda
  config: {
    initialScore: 50,
    scoreToWin: 60,
  },

  //  Inicia a negociação — substituir pelo contexto real da dor do cliente no step1
  step1: {
    npcText: [
      `"Bem-vindo à Quitanda Arco-Íris! Mas ó, se veio oferecer máquina, perdeu a viagem."`,
      `"Eu sou estrategista: uso a amarelinha pro débito, a verdinha pro crédito e a vermelha pro vale-alimentação. Fujo das taxas altas brincando! Tenho a solução perfeita."`,
    ],
    playerOptions: [
      {
        id: "step1_a",
        text: "Eu entendo que você fuja de taxas. Mas manter três provedores gera custos invisíveis no fim do mês que engolem essa economia. E a Cielo tem maquininhas com taxas muito mais competitivas.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: "step1_a_response",
      },
      {
        id: "step1_b",
        text: "É uma estratégia inteligente para as taxas, Julie. Mas me tira uma dúvida: no sábado de manhã, com a quitanda lotada, procurar a máquina certa não acaba travando a sua fila?",
        isCorrect: true,
        satisfaction: +20,
        nextDialog: "step1_b_response",
      },
      {
        id: "step1_c",
        text: "Sua estratégia de custos é ótima, Julie. Mas usar tantas máquinas tira o aspecto profissional da quitanda. Ter uma máquina Cielo passa mais credibilidade e segurança para o seu cliente pagar.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: "step1_c_response",
      },
    ],
  },

  //  Resposta positiva do step1 — substituir pela reação de validação da dor
  step1_b_response: {
    npcText: `"Você tocou num ponto. Sábado a fila dobrou. Passamos o cartão na máquina errada, tivemos que estornar, o cliente reclamou. É, o balcão fica um estresse."`,
    playerOptions: [
      {
        id: "step1_b_next",
        text: "[Continuar ouvindo]",
        isCorrect: true,
        satisfaction: 0,
        nextDialog: "step2",
      },
    ],
  },

  //  Resposta negativa A do step1 — substituir pela reação de conflito/resistência
  step1_a_response: {
    npcText: `"Você acha que eu não sei fazer conta? Eu não pago aluguel em nenhuma! Economizo no tomate e ganho no volume. Não vem querer me ensinar a cuidar do meu dinheiro."`,
    playerOptions: [
      {
        id: "step1_a_recovery",
        text: "Tem razão, subestimei sua gestão. Mas me tira uma dúvida: no sábado lotado, essa troca de máquinas não trava a fila e irrita o cliente?",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: "step2",
      },
      {
        id: "step1_a_fatal",
        text: "É impossível ter algum lucro real dividindo tanto o seu faturamento.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step2",
      },
    ],
  },

  //  Resposta negativa C do step1 — substituir pela reação de indiferença/desvio
  step1_c_response: {
    npcText: `"Credibilidade eu ganho com fruta fresca e barata. Meu cliente não liga pra marca da máquina no balcão, ele quer é pagar rápido e ir embora."`,
    playerOptions: [
      {
        id: "step1_c_recovery",
        text: "Com certeza, eles querem rapidez. Mas essa troca constante de máquinas não acaba atrasando justamente o cliente que tá com pressa?",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: "step2",
      },
      {
        id: "step1_c_fatal",
        text: "Mas uma marca forte sempre atrai clientes que gastam mais.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step2",
      },
    ],
  },

  //  Apresenta o dilema central do step2 — substituir pelo problema operacional/financeiro
  step2: {
    npcText: [
      `"A fila agarra um pouco, mas prefiro o bolso cheio. O duro é à noite."`,
      `"Pra fechar o caixa, tenho que abrir três aplicativos e somar diversos recibos. É um inferno."`,
    ],
    playerOptions: [
      {
        id: "step2_a",
        text: "Para resolver essa bagunça noturna, o ideal é contratar um software de gestão de caixa no computador. Ele puxa as vendas das três máquinas e faz toda essa soma automaticamente.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: "step2_a_response",
      },
      {
        id: "step2_b",
        text: "Se você unificar tudo na Cielo para parar de somar papelzinho, eu consigo zerar o aluguel da sua máquina e cobrir a menor taxa de débito que você tem hoje.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: "step2_b_response",
      },
      {
        id: "step2_c",
        text: "Você acorda de madrugada para ir à CEASA. Quando passa a noite cruzando três aplicativos, quanto do seu sono está sacrificando? A máquina da Cielo tem um aplicativo que já faz essa soma sozinha gratuitamente.",
        isCorrect: true,
        satisfaction: +25,
        nextDialog: "step2_c_response",
      },
    ],
  },

  //  Valida a aceitação da solução correta do step2
  step2_c_response: {
    npcText: `"Eu durmo umas quatro horas por noite. Tem dia que os números não batem e eu desisto. Se a máquina fizesse essa soma sozinha, minha vida mudava."`,
    playerOptions: [
      {
        id: "step2_c_next",
        text: "[Apresentar a solução final]",
        isCorrect: true,
        satisfaction: 0,
        nextDialog: "step3",
      },
    ],
  },

  //  Gerencia a frustração com a opção errada A do step2
  step2_a_response: {
    npcText: `"Pagar mensalidade de sistema? Eu faço essa ginástica toda justamente pra fugir de custo! Você não me escutou falando que a minha meta é economizar?"`,
    playerOptions: [
      {
        id: "step2_a_fatal",
        text: "Verdade, o foco é economizar. Mas quanto do seu sono você perde somando esses extratos na mão toda noite?",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step3",
      },
      {
        id: "step2_a_recovery",
        text: "Mas é o preço que se paga pra ter controle profissional do caixa.",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: "step3",
      },
    ],
  },

  // Trata a objeção gerada pela opção errada B do step2
  step2_b_response: {
    npcText: `"Já te disse que não pago aluguel! E taxa por taxa eu continuo com as que estão aqui. Vai precisar de um motivo melhor pra eu mudar meu esquema.x"`,
    playerOptions: [
      {
        id: "step2_b_recovery",
        text: "Justo. Vamos falar do seu descanso. Quanto tempo você perde de madrugada cruzando esses aplicativos antes de dormir?",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: "step3",
      },
      {
        id: "step2_b_fatal",
        text: "Então eu abaixo a taxa do crédito também pra compensar o trabalho.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step3",
      },
    ],
  },

  //  Aborda o medo final e a objeção de fecho do step3
  step3: {
    npcText: `"Ter um extrato só é o sonho. Mas e se a máquina ficar sem sinal? Com meu 'arco-íris', se a verdinha cai, puxo a amarela. Ficar dependente de uma só me dá calafrios."`,
    emotion: "seria",
    playerOptions: [
      {
        id: "step3_a",
        text: "Pode ficar absolutamente tranquila quanto a isso. A nossa rede é a mais estável do Brasil. Eu te dou minha palavra que você não vai ficar sem sinal no balcão.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: "step3_a_response",
      },
      {
        id: "step3_b",
        text: "Se a rede oscilar, você sempre pode pedir para os clientes pagarem no dinheiro ou fazerem um Pix rápido direto para a sua conta até o sinal da máquina voltar.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: "step3_b_response",
      },
      {
        id: "step3_c",
        text: "É um medo super válido, Julie. Mas a nossa máquina conecta tanto no chip quanto no Wi-Fi da loja. Se a operadora de celular cair, ela não trava o seu caixa.",
        isCorrect: true,
        satisfaction: +25,
        nextDialog: "step3_c_response",
      },
    ],
  },

  //  Conclui a oferta de valor com a resposta correta do step3
  step3_c_response: {
    npcText: `"Espera, ela conecta no Wi-Fi da loja sozinha? Então se o sinal da rua cair, eu não preciso de três máquinas entulhando meu balcão de reserva."`,
    emotion: "feliz",
    playerOptions: [
      {
        id: "step3_c_next",
        text: "[Finalizar negociação]",
        isCorrect: true,
        satisfaction: 0,
        nextDialog: "check_victory",
      },
    ],
  },

  // Trata a reação à opção errada A do step3
  step3_a_response: {
    npcText: `"Nunca cai? Sou feirante há anos. Até a luz do bairro acaba, quem dirá maquininha. Você tá prometendo o impossível só pra fechar a venda."`,
    emotion: "brava",
    playerOptions: [
      {
        id: "step3_a_recovery",
        text: "Tem razão, imprevistos acontecem. Mas se a máquina trocar sozinha pro Wi-Fi da loja pra não parar de vender, você fica mais tranquila?",
        isCorrect: true,
        satisfaction: +15,
        nextDialog: "check_victory",
      },
      {
        id: "step3_a_fatal",
        text: "Pode confiar na minha palavra de gerente, eu garanto 100% de sinal.",
        isCorrect: false,
        satisfaction: -30,
        nextDialog: "check_victory",
      },
    ],
  },

  //  Recupera a credibilidade após a resposta errada do step3
  step3_b_response: {
    npcText: `"Conferir comprovante de Pix no meu celular particular, com a fila gigante e a mão suja de terra? Quero agilidade e solução profissional, não improviso!"`,
    playerOptions: [
      {
        id: "step3_b_recovery",
        text: "Falei besteira. Se eu te mostrar que a máquina usa o Wi-Fi da loja automaticamente pra nunca te deixar na mão, fechamos?",
        isCorrect: true,
        satisfaction: +15,
        nextDialog: "check_victory",
      },
      {
        id: "step3_b_fatal",
        text: "Mas é só um quebra-galho rápido, cliente de feira sempre tem Pix.",
        isCorrect: false,
        satisfaction: -30,
        nextDialog: "final_failure",
      },
    ],
  },

  // Mensagem final de sucesso — substituir pela fala de fechamento positivo da Julie
  final_success: {
    npcText: `"Você soube fazer as perguntas certas. Me fez perceber que eu tava trocando meu precioso tempo de sono por centavos de economia, e bagunçando minha própria loja. Chega desse arco-irís de maquininhas. O restaurante dessa cidade tá com uns problemas, sua ajuda seria bem-vinda."`,
    isEndDialog: true,
    isSuccess: true,
  },

  //  Mensagem final de falha — substituir pela fala de recusa da Julie
  final_failure: {
    npcText: `"Sabe de uma coisa? Vou continuar com a minha bagunça. Dá trabalho, mas pelo menos eu sinto que tenho o controle. Você não entendeu a minha correria. Pode tentar novamente outro dia."`,
    isEndDialog: true,
    isSuccess: false,
  },
};

// ============================================================================
// DIÁLOGO DO POSTO (JOSÉ)
// ============================================================================
export const JOSE_DIALOG = {
  // Configura os limites de pontuação para o cenário de alto faturamento do posto de combustível
  config: {
    initialScore: 50,
    scoreToWin: 70,
  },

  // Enfrenta a resistência inicial sobre margem de lucro e ceticismo com promessas de taxas
  step1: {
    npcText: [
      `"Você tem três minutos. Minha margem na gasolina é de centavos. Já uso a concorrência porque me deram a menor taxa."`,
      `"Se veio oferecer taxa menor, sei que em três meses você sobe tudo de novo. O que você quer?"`
    ],
    playerOptions: [
      {
        id: "step1_a",
        text: "O senhor tem razão em focar na taxa. Eu trago uma proposta agressiva: cubro a oferta da concorrência agora e coloco uma trava de preço no contrato para blindar a sua margem.",
        isCorrect: false,
        satisfaction: -30,
        nextDialog: "step1_a_response",
      },
      {
        id: "step1_b",
        text: "A Cielo oferece um pacote de valor que vai além da taxa. Nossa operação garante reposição imediata de bobinas sem custo e troca expressa de equipamentos. É o melhor custo-benefício.",
        isCorrect: false,
        satisfaction: -30,
        nextDialog: "step1_b_response",
      },
      {
        id: "step1_c",
        text: "Entendo perfeitamente sua postura. Mas brigar por centavos na taxa é enxugar gelo se o dinheiro vaza na operação. Com seu volume, qual o impacto financeiro dos erros de digitação dos frentistas na pista?",
        isCorrect: true,
        satisfaction: +20,
        nextDialog: "step1_c_response",
      },
    ],
  },

  // Valida o impacto financeiro dos erros operacionais cometidos na pista do posto
  step1_c_response: {
    npcText: `"Você tocou numa ferida aberta. Sexta passada um frentista cobrou 20 reais num tanque de 200. Perdi o lucro de 50 abastecimentos num erro só. É um ralo que não consigo fechar."`,
    playerOptions: [
      {
        id: "step1_b_next",
        text: "[Continuar ouvindo]",
        isCorrect: true,
        satisfaction: 0,
        nextDialog: "step2",
      },
    ],
  },

  // Gerencia a irritação do cliente com abordagens de leilão de taxas e foca na recuperação via gestão
  step1_a_response: {
    npcText: `"Contrato no Brasil se rescinde pagando multa. Quando a taxa subir, a dor de cabeça de trocar os equipamentos todos de novo é minha. Não quero leilão de centavos na minha mesa."`,
    playerOptions: [
      {
        id: "step1_a_recovery",
        text: "Fui infeliz na abordagem, o senhor tem experiência para não cair nessa. Esqueça a taxa. Quanto o senhor perde no mês com frentista digitando o valor errado na máquina?",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: "step2",
      },
      {
        id: "step1_a_fatal",
        text: "Mas eu garanto que a nossa política de reajuste é a mais transparente do mercado.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step2",
      },
    ],
  },

  // Trata a rejeição a argumentos de economia de baixo valor para um faturamento milionário
  step1_b_response: {
    npcText: `"Reposição de bobina? Meu faturamento é de milhões por mês e você quer justificar a troca de adquirente com rolo de papel? Você não avaliou o tamanho da minha operação."`,
    playerOptions: [
      {
        id: "step1_c_recovery",
        text: "Tem razão, bobina é o básico. O que custa caro é o erro humano na pista. Como o senhor garante hoje que o frentista cobra o valor exato da bomba?",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: "step2",
      },
      {
        id: "step1_c_fatal",
        text: "Mas a longo prazo, essa redução de custos operacionais impacta o seu lucro líquido.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step2",
      },
    ],
  },

  // Introduz o problema da lentidão na pista e os gargalos causados por falhas de sinal
  step2: {
    npcText: `"O cliente de posto tem pressa. Às vezes a máquina da concorrência perde o sinal debaixo da cobertura metálica, fica processando e a fila vai até a avenida. Carro parado na fila desiste e vai no concorrente."`,
    playerOptions: [
      {
        id: "step2_a",
        text: "É exatamente para isso que o senhor precisa da nossa tecnologia. Nossas máquinas possuem conectividade avançada e o sinal não oscila debaixo de coberturas metálicas. A fluidez da fila será outra.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step2_a_response",
      },
      {
        id: "step2_b",
        text: "Tempo é seu ativo mais valioso. Se integrarmos seu sistema de automação com a Cielo, a máquina lê a bomba e puxa o valor sozinha. Sem digitação e com conexão estável, a fila voa. Faz sentido?",
        isCorrect: true,
        satisfaction: +20,
        nextDialog: "step2_b_response",
      },
      {
        id: "step2_c",
        text: "O caminho para resolver isso é a capacitação contínua. A Cielo disponibiliza relatórios gerenciais diretamente no portal para o senhor monitorar qual frentista está com o maior índice de erros.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step2_c_response",
      },
    ],
  },

  // Explica os benefícios da automação e integração entre bomba e máquina para eliminar o erro humano
  step2_b_response: {
    npcText: `"Espera... o sistema manda o valor da bomba direto pra máquina? O frentista só entrega pro cliente pôr a senha? Isso zera meus erros e corta o tempo pela metade. Aí sim!"`,
    playerOptions: [
      {
        id: "step2_b_next",
        text: "[Apresentar a solução final]",
        isCorrect: true,
        satisfaction: 0,
        nextDialog: "step3",
      },
    ],
  },

  // Reforça que apenas sinal forte não resolve o prejuízo financeiro causado pela má digitação
  step2_a_response: {
    npcText: `"Conexão forte não impede o frentista de continuar digitando o valor errado. Se for só pra trocar a marca do equipamento, meu ralo de dinheiro continua."`,
    playerOptions: [
      {
        id: "step2_a_fatal",
        text: "Faz sentido. A máquina sozinha não faz milagre. E se a gente integrar seu sistema para a máquina ler a bomba sozinha, sem o frentista digitar nada?",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step3",
      },
      {
        id: "step2_a_recovery",
        text: "Mas a estabilidade da rede já reduziria as desistências na fila de forma considerável.",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: "step3",
      },
    ],
  },

  // Trata a impaciência com soluções baseadas em treinamento humano e foca em tecnologia de contenção
  step2_c_response: {
    npcText: `"Acha que eu tenho tempo de cruzar relatório para dar feedback pra 30 frentistas com rotatividade altíssima? Eu preciso de automação que elimine o erro, não de mais processos de RH."`,
    playerOptions: [
      {
        id: "step2_b_recovery",
        text: "A leitura foi minha. O senhor precisa de tecnologia à prova de falhas. Se o nosso equipamento for integrado à bomba e o frentista não precisar digitar, resolve a dor?",
        isCorrect: true,
        satisfaction: +20,
        nextDialog: "step3",
      },
      {
        id: "step2_b_fatal",
        text: "Mas a gestão baseada em dados é fundamental para o sucesso de uma operação desse porte.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step3",
      },
    ],
  },

  // Discute a centralização bancária e a necessidade crítica de fluxo de caixa para pagamento de distribuidores
  step3: {
    npcText: `"Ajeitar a pista é ótimo. Mas meu coração é o tanque. Tenho que pagar o caminhão da distribuidora amanhã à vista. Hoje divido vendas em três bancos para ter limite. Se centralizar na Cielo e vocês segurarem repasse, meu posto amanhece sem gasolina."`,
    playerOptions: [
      {
        id: "step3_a",
        text: "Compreendo perfeitamente a preocupação. Mas centralizando conosco, o senhor terá acesso ao nosso portal de conciliação. A visibilidade dos recebíveis em uma única tela vai otimizar todo o seu setor financeiro.",
        isCorrect: false,
        satisfaction: -25,
        nextDialog: "step3_a_response",
      },
      {
        id: "step3_b",
        text: "Administrar três domicílios bancários é muito ineficiente. A Cielo possui a infraestrutura mais robusta da América Latina. O senhor pode fazer essa migração com total segurança institucional de que não reteremos seu capital.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: "step3_b_response",
      },
      {
        id: "step3_c",
        text: "É um risco, concordo. Mas a resposta para isso é liquidez absoluta. Com o 'Tá na Conta' da Cielo, o senhor recebe as vendas em qualquer conta via Pix, inclusive finais de semana e feriados. Isso garante o caminhão?",
        isCorrect: true,
        satisfaction: +20,
        nextDialog: "step3_c_response",
      },
    ],
  },

  // Consolida a proposta de valor através da tranquilidade na gestão financeira e fluxo D+1
  step3_c_response: {
    npcText: `"Espera aí... cai no fim de semana e feriado também? Via Pix na conta que eu escolher? Bom, se não fico mais refém de dia útil e a bomba manda o valor sozinha... não preciso mais dessa bagunça de três bancos."`,
    playerOptions: [
      {
        id: "step3_c_next",
        text: "[Finalizar negociação]",
        isCorrect: true,
        satisfaction: 0,
        nextDialog: "check_victory",
      },
    ],
  },

  // Trata o ceticismo do cliente quanto a promessas verbais e oferece garantias contratuais de repasse
  step3_b_response: {
    npcText: `"No meu faturamento, eu não confio em segurança institucional, confio em contrato e fluxo de caixa. O tamanho da sua empresa não enche meu tanque de combustível no fim de semana."`,
    playerOptions: [
      {
        id: "step3_b_recovery",
        text: "O senhor tem razão, segurança exige contrato e tecnologia. Por isso temos o 'Tá na Conta'. O dinheiro cai via Pix na sua conta, em dias úteis ou feriados. Fechado?",
        isCorrect: true,
        satisfaction: +15,
        nextDialog: "check_victory",
      },
      {
        id: "step3_b_fatal",
        text: "A solidez financeira da Cielo no mercado já deveria ser a sua maior garantia.",
        isCorrect: false,
        satisfaction: -30,
        nextDialog: "final_failure",
      },
    ],
  },

  // Recupera a negociação apresentando o Repasse Automático customizado para preservar a margem
  step3_a_response: {
    npcText: `"Conciliação visual não paga caminhão de combustível. Se meu dinheiro ficar retido por uma falha no feriado, a bomba seca. Eu preciso de garantia de liquidez, não de dashboard bonito."`,
    playerOptions: [
      {
        id: "step_a_recovery",
        text: "Fui raso, me desculpe. O que importa é liquidez imediata. E se eu incluir o senhor na solução 'Tá na Conta', que paga suas vendas via Pix, inclusive em feriados? ",
        isCorrect: true,
        satisfaction: +25,
        nextDialog: "check_victory",
      },
      {
        id: "step3_a_fatal",
        text: "Mas a longo prazo, essa centralização evita furos no seu balanço contábil.",
        isCorrect: false,
        satisfaction: -30,
        nextDialog: "check_victory",
      },
    ],
  },

  // Exibe a mensagem de sucesso final consolidando a Cielo como parceira estratégica do posto
  final_success: {
    npcText: `"Você tem visão corporativa. Entendeu que meu problema não é a taxa, é a operação e o fluxo de caixa para pagar fornecedor. Manda o contrato de integração e do Pix pra eu assinar."`,
    isEndDialog: true,
    isSuccess: true,
  },

  // Exibe a mensagem de derrota quando as necessidades de fluxo de caixa não são atendidas
  final_failure: {
    npcText: `"Você tem a mentalidade de um vendedor novato. Tentou me ganhar com bobina, promessa vazia e dashboard. Minha operação é complexa demais pra esse tipo de argumento. Reunião encerrada."`,
    isEndDialog: true,
    isSuccess: false,
  },
};


// ============================================================================
// DIÁLOGO DO TXORI (Dono do restaurante)
// ============================================================================
export const TXORI_DIALOG = {
  config: {
    initialScore: 50,     // score inicial de TXORI
    scoreToWin: 65,       // score mínimo para fechar a venda
  },

  // ==========================================================================
  // ROUND 1
  // ==========================================================================
  step1: {
    npcText: [
      `"Opa, seja bem-vindo. Mas olha o salão, tá uma loucura. Meus garçons parecem que tão correndo maratona entre a mesa, a cozinha e o caixa."`,
      `"Se você veio oferecer mais uma maquininha comum pra fazer volume aqui no balcão, agradeço, mas não preciso."`
    ],
    playerOptions: [
      {
        id: 'step1_a',
        text: "Compreendo perfeitamente o cenário. Mas as nossas máquinas possuem a impressão de recibo mais rápida do mercado. Isso agilizaria o tempo de permanência do garçom no caixa e liberaria as mesas com muito mais fluidez, não acha?",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: 'step1_a_response'
      },
      {
        id: 'step1_b',
        text: "É um movimento intenso e que exige muito. Quando o cliente pede a conta, o garçom precisa ir ao sistema, imprimir a conferência, levar à mesa e voltar para buscar a máquina? Isso não acaba travando o giro do salão?",
        isCorrect: true,
        satisfaction: +20,
        nextDialog: 'step1_b_response'
      },
      {
        id: 'step1_c',
        text: "O fluxo de clientes é realmente impressionante. Para compensar esse desgaste da equipe, a Cielo oferece as taxas mais agressivas do setor de alimentação. Isso não traria o alívio financeiro que a sua operação precisa hoje?",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: 'step1_c_response'
      }
    ]
  },

  step1_b_response: {
    npcText: `"Exatamente isso! O cliente já comeu, tá louco pra ir embora e fica lá plantado. E eu com gente na porta esperando mesa vagar. É um retrabalho que me custa dinheiro."`,
    playerOptions: [
      {
        id: 'step1_b_next',
        text: '[Continuar ouvindo]',
        isCorrect: true,
        satisfaction: 0,
        nextDialog: 'step2'
      }
    ]
  },

  step1_a_response: {
    npcText: `"Imprimir rápido não adianta nada se o garçom demora cinco minutos pra atravessar o salão, pegar a máquina aqui no caixa e voltar pra mesa! O problema é a caminhada, não a impressora."`,
    playerOptions: [
      {
        id: 'step1_a_recovery',
        text: "Tem toda a razão. A mobilidade é o verdadeiro gargalo. Quando o garçom dá essas viagens perdidas, como isso afeta a paciência do cliente que quer pagar e ir embora?",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: 'step2'
      },
      {
        id: 'step1_a_fatal',
        text: "Mas cada segundo economizado na impressão da via do cliente conta no final do dia.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: 'step2'
      }
    ]
  },

  step1_c_response: {
    npcText: `"Taxa? Eu perco mais dinheiro com cliente indo embora irritado com a demora do que com taxa de cartão. Meu problema é operação, não é centavo."`,
    playerOptions: [
      {
        id: 'step1_c_recovery',
        text: "Entendi perfeitamente. A operação é o coração da casa. Você já conseguiu medir quantas mesas deixa de atender por dia por causa dessa lentidão no fechamento da conta?",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: 'step2'
      },
      {
        id: 'step1_c_fatal',
        text: "Mas a longo prazo, essa diferença nas taxas fará muita diferença na sua margem de lucro.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: 'step2'
      }
    ]
  },

  // ==========================================================================
  // ROUND 2
  // ==========================================================================
  step2: {
    npcText: `"O pior de tudo não é nem a caminhada. É o erro. O garçom anota no papel, digita no tablet pra mandar pra cozinha e, na hora de cobrar, tem que digitar o valor na mão, lá na maquininha. É muita chance de dar problema."`,
    playerOptions: [
      {
        id: 'step2_a',
        text: "Uma operação desse tamanho exige estrutura. A solução ideal seria contratar um operador de caixa fixo, focado apenas em processar os pagamentos. Isso tira a responsabilidade da cobrança da mão do garçom e zera os erros de digitação.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: 'step2_a_response'
      },
      {
        id: 'step2_b',
        text: "Para eliminar o erro humano na digitação, a melhor alternativa é implementar pagamentos via QR Code nas mesas. Assim, o próprio cliente faz o processo de pagamento pelo celular e o garçom foca apenas em servir os pratos.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: 'step2_b_response'
      },
      {
        id: 'step2_c',
        text: "Digitar valores na pressa é um risco enorme para o caixa. Quantas vezes no mês o fechamento fica no vermelho porque um garçom, na correria do almoço, esqueceu de digitar um zero ou cobrou o valor de outra mesa?",
        isCorrect: true,
        satisfaction: +25,
        nextDialog: 'step2_c_response'
      }
    ]
  },

  step2_c_response: {
    npcText: `"Nem me lembre... Sexta passada perdemos quase 300 reais só de erro de digitação. Fora o constrangimento de ter que ir atrás do cliente quando o garçom cobra a mesa errada. É um pesadelo."`,
    playerOptions: [
      {
        id: 'step2_c_next',
        text: '[Apresentar a solução final]',
        isCorrect: true,
        satisfaction: 0,
        nextDialog: 'step3'
      }
    ]
  },

  step2_a_response: {
    npcText: `"Contratar mais gente? Minha folha de pagamento já tá no limite! Eu preciso de algo que facilite a vida dos garçons que eu já tenho, não de mais despesa."`,
    playerOptions: [
      {
        id: 'step2_a_fatal',
        text: "Mas é o preço estrutural que se paga pelo crescimento do volume de vendas do restaurante.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: 'step3'
      },
      {
        id: 'step2_a_recovery',
        text: "Aumentar custo nunca é a melhor saída, concordo. Se o garçom não precisasse digitar nada porque a máquina já puxa o valor do sistema, quantos erros evitaríamos?",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: 'step3'
      }
    ]
  },

  step2_b_response: {
    npcText: `"Meu público é tradicional! Eles gostam de ser atendidos pelo garçom. Se eu botar a obrigação de pagar pelo celular, metade dos meus clientes não volta."`,
    playerOptions: [
      {
        id: 'step2_b_recovery',
        text: "Faz sentido, o atendimento humano é a marca da casa. Pensando no garçom, qual o impacto financeiro quando ele digita 15 reais na máquina, mas a conta era de 150?",
        isCorrect: true,
        satisfaction: +10,
        nextDialog: 'step3'
      },
      {
        id: 'step2_b_fatal',
        text: "Mas o consumidor moderno precisa se adaptar à tecnologia de autoatendimento uma hora ou outra.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: 'step3'
      }
    ]
  },

  // ==========================================================================
  // ROUND 3
  // ==========================================================================
  step3: {
    npcText: `"Eu preciso de um milagre onde o garçom não precise carregar um bloco de notas, um tablet pra comandas e ainda uma máquina de cartão. Mas não existe aparelho que faça tudo isso."`,
    playerOptions: [
      {
        id: 'step3_a',
        text: "A solução não é milagre, é tecnologia integrada. Com a Cielo Lio On, o seu sistema de restaurante roda direto na máquina de cartão. O garçom abre a mesa, faz o pedido e cobra o cliente na mesma tela, tudo num só equipamento.",
        isCorrect: true,
        satisfaction: +25,
        nextDialog: 'step3_a_response'
      },
      {
        id: 'step3_b',
        text: "Para resolver esse excesso de equipamentos, nós temos terminais que se integram via conexão Bluetooth ao seu computador principal. O garçom aproxima o equipamento do caixa e os dados da mesa são transferidos sem precisar de fios.",
        isCorrect: false,
        satisfaction: -10,
        nextDialog: 'step3_b_response'
      },
      {
        id: 'step3_c',
        text: "Pensando no peso que o garçom carrega, o ideal é usar a Cielo Zip. É um equipamento de bolso, extremamente leve e prático. Ele continua usando o tablet para o pedido, mas puxa a maquininha do avental na hora exata de cobrar.",
        isCorrect: false,
        satisfaction: -20,
        nextDialog: 'step3_c_response'
      }
    ]
  },

  step3_a_response: {
    npcText: `"Pera aí... o aplicativo do restaurante roda dentro da maquininha da Cielo? O garçom faz o pedido e já passa o cartão no mesmo aparelho? Isso ia acabar com as viagens perdidas e com os erros de valor!"`,
    playerOptions: [
      {
        id: 'step3_a_next',
        text: '[Finalizar negociação]',
        isCorrect: true,
        satisfaction: 0,
        nextDialog: 'check_victory' 
      }
    ]
  },

  step3_b_response: {
    npcText: `"Bluetooth? Isso dá uma interferência danada. E não resolve o garçom ter que carregar um monte de coisa na mão. Não gostei."`,
    playerOptions: [
      {
        id: 'step3_b_recovery',
        text: "Você tem razão, Bluetooth oscila. O que eu tenho é uma máquina com Android. O seu app de restaurante roda dentro dela. Ter tudo em um único equipamento seria o ideal?",
        isCorrect: true,
        satisfaction: +15,
        nextDialog: 'check_victory' 
      },
      {
        id: 'step3_b_fatal',
        text: "Mas as novas versões de conexão Bluetooth são super estáveis, o senhor pode confiar.",
        isCorrect: false,
        satisfaction: -30,
        nextDialog: 'final_failure' 
      }
    ]
  },

  step3_c_response: {
    npcText: `"Mais leve? O garçom ainda vai ter que ficar operando um tablet numa mão e uma maquininha na outra no meio do salão cheio! A chance de derrubar e quebrar os dois dobra. Você não escutou o que eu disse?"`,
    playerOptions: [
      {
        id: 'step3_c_recovery',
        text: "Foi falha minha. Equilibrar aparelhos é pedir pra ter prejuízo. E se eu apresentar a Cielo Lio On, que é literalmente o seu tablet de pedidos e a máquina de cartão fundidos num aparelho só?",
        isCorrect: true,
        satisfaction: +15,
        nextDialog: 'check_victory'
      },
      {
        id: 'step3_c_fatal',
        text: "Mas a maquininha menor cabe no bolso, é só ele ter mais cuidado na hora de atender a mesa.",
        isCorrect: false,
        satisfaction: -30,
        nextDialog: 'final_failure'
      }
    ]
  },

  // ==========================================================================
  // ENDINGS
  // ==========================================================================
  final_success: {
    npcText: `"Tirar o bloquinho e a calculadora da mão do meu garçom e dar uma maquininha que faz tudo vai mudar meu giro de mesas. Traz essa Lio On pra ontem! Você já passou no posto de gasolina? Acho que uma mãozinha sua cairia bem lá."`,
    isEndDialog: true,
    isSuccess: true
  },

  final_failure: {
    npcText: `"Você tá focado demais nas suas taxas e nas suas máquinas comuns. Você não entende a correria de um salão de restaurante. Vou continuar do meu jeito, com licença que eu tenho mesa pra atender. Pode tentar novamente depois."`,
    isEndDialog: true,
    isSuccess: false
  }
};

// ==========================================================================
// SALVAGUARDAS DE VALIDAÇÃO (JS PURO)
// ==========================================================================

export function validarEstruturaDialogo(cenario, nomeCenario) {
  const chavesDoCenario = Object.keys(cenario);
  // Estados globais do seu jogo que não estão dentro do objeto do NPC
  const chavesGlobaisPermitidas = ['check_victory', 'final_success', 'final_failure', 'step2', 'step3']; 

  chavesDoCenario.forEach(chave => {
    if (chave === 'config') return; 

    const etapa = cenario[chave];
    
    // Verifica as opções do jogador
    if (etapa.playerOptions) {
      etapa.playerOptions.forEach((opcao, index) => {
        // 1. Checa se faltou alguma propriedade obrigatória
        if (!opcao.id || !opcao.text || typeof opcao.isCorrect !== 'boolean' || typeof opcao.satisfaction !== 'number' || !opcao.nextDialog) {
          console.error(`[Erro na Matriz] Cenário ${nomeCenario}, Etapa '${chave}', Opção ${index}: Faltam propriedades ou os tipos estão errados.`);
        }

        // 2. Checa se o próximo diálogo existe (evita tela travada/morta)
        const destinoExiste = chavesDoCenario.includes(opcao.nextDialog) || chavesGlobaisPermitidas.includes(opcao.nextDialog);
        if (!destinoExiste) {
          console.warn(`[Caminho Quebrado] Cenário ${nomeCenario}, Etapa '${chave}': O nextDialog aponta para '${opcao.nextDialog}', mas esse passo não existe!`);
        }
      });
    }
  });
}

// Roda a validação assim que o arquivo é importado
validarEstruturaDialogo(OSWALDO_DIALOG, "Oswaldo");
validarEstruturaDialogo(JULIE_DIALOG, "Julie");
validarEstruturaDialogo(JOSE_DIALOG, "José");
validarEstruturaDialogo(TXORI_DIALOG, "Txori");

// ==========================================================================
// SALVAGUARDA DE IMUTABILIDADE (DEEP FREEZE)
// ==========================================================================

function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);

  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

// Trava as árvores de diálogo para que o jogo não as modifique em tempo de execução
deepFreeze(OSWALDO_DIALOG);
deepFreeze(JULIE_DIALOG);
deepFreeze(JOSE_DIALOG);
deepFreeze(TXORI_DIALOG);