function CalculatePrice(data) {
    points = 0;
    // living space
    points += parseInt(data.additional.wonen);
    // other space
    points += parseInt(data.additional.overige) + parseInt(data.additional.externe);

    // energy label
    if (parseInt(data.additional.wonen) < 25) {
        if (data.energylabel == "A") {
            points += 5;
        }
    }
};

function calculateHuurcommissieScore(apartment) {
    const {
      vertrekken,
      overigeRuimten,
      verwarming,
      energieLabel,
      eengezinswoning,
      oppervlakte,
      keukenLengte,
      keukenInvestering,
      sanitair,
      sanitairInvestering,
      gehandicaptenVoorzieningen,
      buitenruimte,
      carport,
      wozWaarde,
      rijksmonument,
      renovatieInvestering,
      renovatieJaar
    } = apartment;
  
    let score = 0;
  
    // 1. Oppervlakte van vertrekken
    score += vertrekken * 1;
  
    // 2. Oppervlakte van overige ruimten
    score += overigeRuimten * 0.75;
  
    // 3. Verwarming
    score += verwarming * 2;
    if (verwarming > 4) {
      score -= (verwarming - 4);
    }
  
    // 4. Energieprestatie
    const energyLabelPoints = (function () {
      const energyLabels = ['A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
      const pointsTable = [
        [52, 48, 44, 40, 36, 32, 22, 15, 4, 1, 0],
        [48, 44, 40, 36, 32, 28, 22, 15, 14, 11, 4, 1, 0],
        [44, 40, 36, 32, 22, 15, 14, 11, 8, 5, 4, 1, 0]
      ];
  
      const index = energyLabels.indexOf(energieLabel);
      if (index === -1) {
        return 0;
      }
  
      if (oppervlakte < 25) {
        return eengezinswoning ? pointsTable[0][index] : pointsTable[0][index + 1];
      } else if (oppervlakte >= 25 && oppervlakte < 40) {
        return eengezinswoning ? pointsTable[1][index] : pointsTable[1][index + 1];
      } else {
        return eengezinswoning ? pointsTable[2][index] : pointsTable[2][index + 1];
      }
    })();
  
    score += energyLabelPoints;
  
    // 5. Keuken
    if (keukenLengte < 1) {
      score += 0;
    } else if (keukenLengte >= 1 && keukenLengte < 2) {
      score += 4;
    } else {
      score += 7;
    }
    score += Math.floor(keukenInvestering / 226.89);
  
    // 6. Sanitair
    score += 3 * sanitair.toilet;
    score += 1 * sanitair.wastafel;
    score += 4 * sanitair.douche;
    score += 6 * sanitair.bad;
    score += 7 * sanitair.badEnDouche;
    score += Math.floor(sanitairInvestering / 226.89);
  
    // 7. Woonvoorzieningen voor gehandicapten
    score += Math.floor(gehandicaptenVoorzieningen / 226.89);
  
    // 8. Privé-buitenruimten
    if (buitenruimte < 25) {
      score += 2;
    } else if (buitenruimte >= 25 && buitenruimte < 50) {
      score += 4;
    } else if (buitenruimte >= 50 && buitenruimte < 75) {
      score += 6;
    } else if (buitenruimte >= 75 && buitenruimte < 100) {
      score += 8;
    } else {
      score += 10;
    }
    if (carport) {
      score += 2;
    }
  
    // 9. Punten voor de WOZ-waarde
    if (wozWaarde >= 55888) {
      score += Math.floor(wozWaarde / 11041);
    }
  
    const wozPoints = (wozWaarde * vertrekken) / (overigeRuimten * (eengezinswoning ? 172 : 73));
    score += wozPoints;
  
    // 10. Renovatie
    const currentYear = new Date().getFullYear();
    if (
      renovatieInvestering >= 10000 &&
      renovatieJaar &&
      currentYear - renovatieJaar >= 0 &&
      currentYear - renovatieJaar <= 5
    ) {
      score += 0.2 * (renovatieInvestering / 1000) * (currentYear - renovatieJaar);
    }
  
    // 11. Hinderlijke situaties (vervallen per 1 oktober 2015)
  
    // 12. Bijzondere voorzieningen
    // Please implement the logic for special provisions points based on the given conditions
  
    // 13. Waardering woning in schaarstegebied (vervallen per 1 oktober 2015)
  
    // 14. Rijksmonument
    if (rijksmonument) {
      score += 50;
    }
  
    return score;
  }