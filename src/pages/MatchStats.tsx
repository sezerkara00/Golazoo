import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface StatisticsItem {
  name: string;
  home: string;
  away: string;
  homeValue: number;
  awayValue: number;
  statisticsType: string;
}

interface StatisticsGroup {
  groupName: string;
  statisticsItems: StatisticsItem[];
}

interface MatchStatsProps {
  matchId: number;
}

const MatchStats = ({ matchId }: MatchStatsProps) => {
  const [statsGroups, setStatsGroups] = useState<StatisticsGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/event/${matchId}/statistics`);
        setStatsGroups(response.data.statistics[0].groups);
      } catch (error) {
        console.error('Maç istatistikleri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [matchId]);

  const getStatName = (name: string) => {
    const translations: { [key: string]: string } = {
      'Match overview': 'Genel İstatistikler',
      'Shots': 'Şutlar',
      'Attack': 'Hücum',
      'Passes': 'Paslar',
      'Duels': 'Düellolar',
      'Defending': 'Savunma',
      'Goalkeeping': 'Kaleci',
      'Ball possession': 'Topa Sahip Olma',
      'Total shots': 'Toplam Şut',
      'Shots on target': 'İsabetli Şut',
      'Shots off target': 'İsabetsiz Şut',
      'Blocked shots': 'Bloke Edilen Şut',
      'Corner kicks': 'Korner',
      'Offsides': 'Ofsayt',
      'Fouls': 'Faul',
      'Yellow cards': 'Sarı Kart',
      'Red cards': 'Kırmızı Kart',
      'Big chances': 'Net Pozisyon',
      'Goalkeeper saves': 'Kaleci Kurtarışı',
      'Accurate passes': 'İsabetli Pas',
      'Long balls': 'Uzun Top',
      'Crosses': 'Orta',
      'Tackles': 'Müdahale',
      'Interceptions': 'Top Kapma',
      'Clearances': 'Top Uzaklaştırma',
      'Hit woodwork': 'Direkten Dönen',
    };
    return translations[name] || name;
  };

  const renderStatBar = (home: number, away: number) => {
    const total = home + away;
    const homePercent = total > 0 ? (home / total) * 100 : 50;
    const awayPercent = total > 0 ? (away / total) * 100 : 50;

    return (
      <div className="flex h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="bg-blue-500 h-full transition-all" style={{ width: `${homePercent}%` }} />
        <div className="bg-red-500 h-full transition-all" style={{ width: `${awayPercent}%` }} />
      </div>
    );
  };

  if (loading) return <div className="text-center">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      {statsGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">{getStatName(group.groupName)}</h3>
          <div className="space-y-4">
            {group.statisticsItems.map((stat, statIndex) => (
              <div key={statIndex} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-white">{stat.home}</span>
                  <span className="text-gray-400">{getStatName(stat.name)}</span>
                  <span className="font-bold text-white">{stat.away}</span>
                </div>
                {renderStatBar(stat.homeValue, stat.awayValue)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchStats; 