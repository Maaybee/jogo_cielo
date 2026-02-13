/**
 * Dados de diálogo da Padaria - Oswaldo
 * Sistema de conversa com opções corretas e erradas
 * Cada opção afeta a barra de satisfação do cliente
 */

export const OSWALDO_DIALOG = {
  // ETAPA 1 - Apresentação do problema
  etapa1: {
    npcText: `"Opa, olá jovem. Nem precisa me oferecer mais uma maquininha. Meu pão tá subindo, minha luz tá cara, minhas contas estão mais apertadas que o meu cinto e eu nem consigo ver a cor do dinheiro que passa nessas maquininhas, são muitas taxas.`,
    playerOptions: [
      {
        id: 'etapa1_a',
        text: 'Entendo, sr Oswaldo. Mas a Cielo é a maior empresa da América Latina no ramo, temos as melhores taxas do mercado.',
        isCorrect: false,
        satisfaction: -10,
        nextDialog: 'etapa1_a_response'
      },
      {
        id: 'etapa1_b',
        text: 'Eu entendo a sua frustração, sr Oswaldo. Gestão financeira é o coração de qualquer negócio. Além da maquininha você tem alguma ferramenta que te ajude a ver onde seu dinheiro está indo?',
        isCorrect: true,
        satisfaction: +20,
        nextDialog: 'etapa1_b_response'
      },
      {
        id: 'etapa1_c',
        text: 'É uma pena, mas você sabia que a Cielo está em 99% do território nacional? Você não vai ter nenhum problema de sinal conosco.',
        isCorrect: false,
        satisfaction: -10,
        nextDialog: 'etapa1_c_response'
      }
    ]
  },

  // Respostas da Etapa 1
  etapa1_a_response: {
    npcText: `"E no que isso me ajuda? Pra mim você é só mais um querendo tirar o pouco lucro que me resta. Não quero vendedores genéricos na minha loja.`,
    playerOptions: [
      {
        id: 'etapa1_a_1',
        text: 'Desculpa, sr Oswaldo, eu realmente fui direto ao ponto e esqueci que o importante aqui é o senhor. Qual o grande problema atualmente?',
        isCorrect: true,
        satisfaction: +15,
        nextDialog: 'etapa2'
      },
      {
        id: 'etapa1_a_2',
        text: 'Os números não mentem, sr Oswaldo. Se somos os maiores somos os melhores.',
        isCorrect: false,
        satisfaction: -15,
        nextDialog: 'etapa2'
      }
    ]
  },

  etapa1_b_response: {
    npcText: `"Olha garoto, até que enfim alguém parece realmente se importar com os problemas de um velho. Eu me perco naqueles extratos do banco atual, parece que meu dinheiro evapora.`,
    playerOptions: [
      {
        id: 'etapa1_b_next',
        text: 'Entendi, vamos conversar mais sobre isso.',
        isCorrect: true,
        satisfaction: +10,
        nextDialog: 'etapa2'
      }
    ]
  },

  etapa1_c_response: {
    npcText: `"Sinal? O sinal aqui é ótimo, meu problema é o custo! Você não prestou atenção no que eu disse? Meu pão está indo para as nuvens."`,
    playerOptions: [
      {
        id: 'etapa1_c_1',
        text: 'O senhor tem razão. Sinal não adianta de nada se as contas não fecharem no final do mês. Diga-me mais sobre o problema que eu te ajudo a reduzir esse estresse.',
        isCorrect: true,
        satisfaction: +15,
        nextDialog: 'etapa2'
      },
      {
        id: 'etapa1_c_2',
        text: 'Eu preste atenção sim, mas sem sinal o senhor nem consegue passar o cartão',
        isCorrect: false,
        satisfaction: -15,
        nextDialog: 'etapa2'
      }
    ]
  },

  // ETAPA 2 - Problema principal (demora no recebimento)
  etapa2: {
    npcText: `"A grande questão aqui meu jovem é que eu vendo no crédito hoje e parece que o banco sequestra o meu dinheiro por longos 30 dias. Eu preciso pagar o fornecedor de farinha amanhã, perdoe meu palavreado, estou nervoso com a situação.`,
    playerOptions: [
      {
        id: 'etapa2_a',
        text: 'Infelizmente esse é o prazo padrão, o senhor precisa se planejar melhor com o seu estoque e seus fornecedores.',
        isCorrect: false,
        satisfaction: -20,
        nextDialog: 'etapa2_a_response'
      },
      {
        id: 'etapa2_b',
        text: 'Se o senhor vender só no pix eu consigo te ajudar, quer desabilitar o crédito? O dinheiro cairia direto na sua conta.',
        isCorrect: false,
        satisfaction: -15,
        nextDialog: 'etapa2_b_response'
      },
      {
        id: 'etapa2_c',
        text: 'Na Cielo a gente consegue configurar o recebimento em 2 dias ou até a antecipação de recebíveis. O senhor vende hoje e o dinheiro cai na conta para pagar o fornecedor sem sustos.',
        isCorrect: true,
        satisfaction: +25,
        nextDialog: 'etapa2_c_response'
      }
    ]
  },

  // Respostas da Etapa 2
  etapa2_a_response: {
    npcText: `"Planejar? Eu sou um padeiro, não um mágico. Se você não tem uma solução de verdade para o meu problema pode ir saindo por favor.`,
    playerOptions: [
      {
        id: 'etapa2_a_1',
        text: 'Só estou sendo realista Sr Oswaldo, todos os bancos funcionam assim.',
        isCorrect: false,
        satisfaction: -20,
        nextDialog: 'etapa3'
      },
      {
        id: 'etapa2_a_2',
        text: 'Me expressei mal, perdão. A Cielo tem planos específicos para antecipar esses valores para estabelecimentos que têm giro rápido igual a sua padaria. Quer ver como funciona?',
        isCorrect: true,
        satisfaction: +20,
        nextDialog: 'etapa3'
      }
    ]
  },

  etapa2_b_response: {
    npcText: `"Vender só no pix? Minhas vendas cairiam muito se eu vendesse só no pix. Isso está 100% fora de cogitação.`,
    playerOptions: [
      {
        id: 'etapa2_b_1',
        text: 'Tem razão, sr Oswaldo sua padaria perderia muitos clientes vendendo apenas no pix. A Cielo tem planos para varejos com giro rápido, quer que eu te fale mais sobre eles?',
        isCorrect: true,
        satisfaction: +20,
        nextDialog: 'etapa3'
      },
      {
        id: 'etapa2_b_2',
        text: 'Então eu não posso fazer nada por você, quer dinheiro direto na conta? Venda em débito ou em pix.',
        isCorrect: false,
        satisfaction: -25,
        nextDialog: 'etapa3'
      }
    ]
  },

  etapa2_c_response: {
    npcText: `"Isso me ajudaria muito, meu fornecedor não é o tipo de cara que consegue esperar muito tempo para receber, sabe como é.`,
    playerOptions: [
      {
        id: 'etapa2_c_next',
        text: 'Ótimo! Vamos conversar mais sobre as soluções da Cielo.',
        isCorrect: true,
        satisfaction: +10,
        nextDialog: 'etapa3'
      }
    ]
  },

  // ETAPA 3 - Convencimento final
  etapa3: {
    npcText: `"Me parece bom, mas trocar tudo dá um trabalho… Isso vale a pena mesmo?"`,
    playerOptions: [
      {
        id: 'etapa3_a',
        text: 'Vale sim sr Oswaldo, com certeza vale. A Cielo além de tudo isso te dá ferramentas de análise de dados para você entender melhor em quais horários vende mais e como atrair mais clientes.',
        isCorrect: true,
        satisfaction: +25,
        nextDialog: 'final_success'
      },
      {
        id: 'etapa3_b',
        text: 'Vale sim, a Cielo é uma empresa pró-ética e a melhor avaliada no Reclame Aqui!',
        isCorrect: false,
        satisfaction: -10,
        nextDialog: 'etapa3_b_response'
      }
    ]
  },

  // Resposta da Etapa 3 B
  etapa3_b_response: {
    npcText: `"Isso é muito bonito no papel, mas não me ajuda a vender sonho de creme rapaz. Preciso de algo prático, uma garantia que vocês não vão me tratar só como mais um.`,
    playerOptions: [
      {
        id: 'etapa3_b_1',
        text: 'Tem razão, sr Oswaldo. Se o que você quer é uma garantia que não vai ser só mais um eu tenho a solução, além de ética nós temos suporte 24h e gestão de vendas pelo app. Isso ajuda?',
        isCorrect: true,
        satisfaction: +20,
        nextDialog: 'final_success'
      },
      {
        id: 'etapa3_b_2',
        text: 'Mas nossa ética e nossa reputação já não são fundamentais para você não se sentir enganado?',
        isCorrect: false,
        satisfaction: -20,
        nextDialog: 'final_failure'
      }
    ]
  },

  // FINAIS
  final_success: {
    npcText: `"Me mostre onde eu assino garoto, você me convenceu. Me explicou bem sobre o produto e me deu uma solução útil para o meu problema."`,
    playerOptions: [
      {
        id: 'final_success_end',
        text: 'Venda concluída com sucesso!',
        isCorrect: true,
        satisfaction: 0,
        nextDialog: null
      }
    ],
    isEndDialog: true,
    isSuccess: true
  },

  final_failure: {
    npcText: `"Quer saber de algo, eu acho que prefiro continuar as coisas do jeito que estão. Prefiro não me arriscar, você não me passou muita confiança sinceramente."`,
    playerOptions: [
      {
        id: 'final_failure_end',
        text: 'Venda não realizada.',
        isCorrect: false,
        satisfaction: 0,
        nextDialog: null
      }
    ],
    isEndDialog: true,
    isSuccess: false
  }
};

// Condições de vitória/derrota
export const VICTORY_CONDITIONS = {
  SUCCESS_THRESHOLD: 70,      // Satisfação >= 70: Venda bem-sucedida
  FAILURE_THRESHOLD: 25,      // Satisfação < 25: Venda fracassada
  INITIAL_SATISFACTION: 50    // Satisfação inicial
};
