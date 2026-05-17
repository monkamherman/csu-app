export type LocationTree = Record<string, Record<string, string[]>>;

export const cameroonLocations: LocationTree = {
  Adamaoua: {
    Vina: ['Ngaoundere 1', 'Ngaoundere 2', 'Ngaoundere 3'],
    Mbere: ['Meiganga', 'Dir', 'Djohong'],
  },
  Centre: {
    Mfoundi: ['Yaounde 1', 'Yaounde 2', 'Yaounde 3', 'Yaounde 4', 'Yaounde 5', 'Yaounde 6', 'Yaounde 7'],
    Nyong_et_So: ['Akonolinga', 'Mengang', 'Messamena'],
  },
  East: {
    Lom_et_Djerem: ['Bertoua 1', 'Bertoua 2', 'Belabo'],
    Haut_Nyong: ['Abong-Mbang', 'Messok', 'Lomie'],
  },
  Far_North: {
    Mayo_Danay: ['Yagoua', 'Guere', 'Kai-Kai'],
    Diamare: ['Maroua 1', 'Maroua 2', 'Bogo'],
  },
  Littoral: {
    Wouri: ['Douala 1', 'Douala 2', 'Douala 3', 'Douala 4', 'Douala 5'],
    Moungo: ['Nkongsamba 1', 'Nkongsamba 2', 'Mbanga'],
  },
  North: {
    Benoue: ['Garoua 1', 'Garoua 2', 'Bibemi'],
    Faro: ['Poli', 'Beka', 'Mbe'],
  },
  North_West: {
    Mezam: ['Bamenda 1', 'Bamenda 2', 'Bamenda 3'],
    Bui: ['Kumbo', 'Jakiri', 'Mbiame'],
  },
  South: {
    Ocean: ['Kribi 1', 'Kribi 2', 'Akom 2'],
    Mvila: ['Ebolowa 1', 'Ebolowa 2', 'Mengong'],
  },
  South_West: {
    Fako: ['Buea', 'Limbe 1', 'Limbe 2', 'Tiko'],
    Meme: ['Kumba 1', 'Kumba 2', 'Mbonge'],
  },
  West: {
    Mifi: ['Bafoussam 1', 'Bafoussam 2', 'Bafoussam 3'],
    Nde: ['Bangangte', 'Bassamba', 'Bazou'],
  },
};
