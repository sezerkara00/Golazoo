import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import '../../styles/match-detail.css'

interface Team {
  name: string
  logo: string
}

interface Match {
  homeTeam: Team
  awayTeam: Team
  score?: string
}

export default function MatchDetail() {
  const router = useRouter()
  const { id } = router.query
  const [match, setMatch] = useState<Match | null>(null)

  useEffect(() => {
    if (id) {
      fetchMatchDetails(id)
    }
  }, [id])

  const fetchMatchDetails = async (matchId: string | string[]) => {
    try {
      // Geçici olarak statik veri kullanıyoruz
      const matchData = {
        homeTeam: {
          name: 'Stade Brestois',
          logo: 'https://img.sofascore.com/api/v1/team/1715/image'
        },
        awayTeam: {
          name: 'Paris Saint-Germain',
          logo: 'https://img.sofascore.com/api/v1/team/1716/image'
        },
        score: '0 - 0'
      }
      setMatch(matchData)
    } catch (error) {
      console.error('Maç detayları alınamadı:', error)
    }
  }

  if (!match) return <div>Yükleniyor...</div>

  return (
    <div className="match-detail-container">
      <div className="team-logos">
        <div className="home-team">
          <Image 
            src={match.homeTeam.logo}
            alt={`${match.homeTeam.name} logo`}
            width={64}
            height={64}
            priority
          />
          <span>{match.homeTeam.name}</span>
        </div>
        
        <div className="score">
          {match.score || '0 - 0'}
        </div>
        
        <div className="away-team">
          <Image 
            src={match.awayTeam.logo}
            alt={`${match.awayTeam.name} logo`}
            width={64}
            height={64}
            priority
          />
          <span>{match.awayTeam.name}</span>
        </div>
      </div>
    </div>
  )
} 