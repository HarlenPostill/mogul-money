import { QRCodeSVG } from 'qrcode.react'
import type { Player } from '../types'
import logo from '../assets/large-logo.png'
import './Lobby.css'

interface Props {
  players: Player[]
  joinUrl: string
}

export default function Lobby({ players, joinUrl }: Props) {
  return (
    <div className="lobby">
      <div className="lobby__left">
        <img className="lobby__logo" src={logo} alt="Mogul Money" />
        <p className="mm-eyebrow">Scan to join as a contestant</p>
        <div className="lobby__qr">
          <QRCodeSVG
            value={joinUrl}
            size={512}
            level="M"
            bgColor="transparent"
            fgColor="#2C0549"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
        <p className="lobby__url">{joinUrl}</p>
      </div>

      <div className="lobby__right">
        <p className="mm-eyebrow">
          {players.length} {players.length === 1 ? 'team' : 'teams'} in the room
        </p>
        <ul className="lobby__teams">
          {players.map((player) => (
            <li key={player.id} className="lobby__team">
              {player.name}
            </li>
          ))}
          {players.length === 0 && (
            <li className="lobby__empty">Waiting for the first team…</li>
          )}
        </ul>
      </div>
    </div>
  )
}
