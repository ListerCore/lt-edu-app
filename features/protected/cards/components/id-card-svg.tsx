import type { JSX } from 'react';
import { finderOrigins, isFinder, QR_SIZE, qrCells } from '@/lib/qr-pattern';
import { cardFormats, cardPalette as color } from '../data/cards-data';
import type { Cardholder, IdCardSvgProps } from '../types';

const FONT = 'Inter, Helvetica, Arial, sans-serif';
const MONO = '"Geist Mono", Menlo, monospace';

// Breaks a long name into two lines at the last space that fits
const nameLines = (name: string, max: number): string[] => {
  if (name.length <= max) return [name];
  const cut = name.lastIndexOf(' ', max);
  return cut > 0 ? [name.slice(0, cut), name.slice(cut + 1)] : [name];
};

// The attendance QR the gate reads, from joseph-api's modules (with a one-module quiet zone of paper)
const RealQr = ({ qr, x, y, size }: { qr: { size: number; modules: string }; x: number; y: number; size: number }): JSX.Element => {
  const cell = size / (qr.size + 2);
  const rows: string[] = [];
  for (let r = 0; r < qr.size; r++) {
    // One path per row: runs of dark modules as rectangles
    let d = '';
    let run = -1;
    for (let c = 0; c <= qr.size; c++) {
      const on = c < qr.size && qr.modules[r * qr.size + c] === '1';
      if (on && run < 0) run = c;
      if (!on && run >= 0) {
        d += `M${run + 1} ${r + 1}h${c - run}v1h-${c - run}z`;
        run = -1;
      }
    }
    if (d) rows.push(d);
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${cell})`} shapeRendering="crispEdges">
      <rect width={qr.size + 2} height={qr.size + 2} fill={color.paper} />
      <path d={rows.join('')} fill={color.ink} />
    </g>
  );
};

// Decorative QR-like pattern for demo cardholders that have no card in joseph-api
const Qr = ({ seed, x, y, size, qr }: { seed: string; x: number; y: number; size: number; qr?: { size: number; modules: string } | null }): JSX.Element => {
  if (qr && qr.size > 0 && qr.modules.length === qr.size * qr.size) return <RealQr qr={qr} x={x} y={y} size={size} />;
  const cell = size / QR_SIZE;
  return (
    <g transform={`translate(${x} ${y}) scale(${cell})`} fill={color.ink} shapeRendering="crispEdges">
      <rect x="-1" y="-1" width={QR_SIZE + 2} height={QR_SIZE + 2} fill={color.paper} />
      {qrCells(seed).map((on, index): JSX.Element | null => {
        const cx = index % QR_SIZE;
        const cy = Math.floor(index / QR_SIZE);
        return on && !isFinder(cx, cy) ? <rect key={index} x={cx} y={cy} width="1" height="1" /> : null;
      })}
      {finderOrigins.map(([fx, fy]): JSX.Element => (
        <g key={`${fx}-${fy}`}>
          <path d={`M${fx} ${fy}h7v7h-7z M${fx + 1} ${fy + 1}v5h5v-5z`} fillRule="evenodd" />
          <rect x={fx + 2} y={fy + 2} width="3" height="3" />
        </g>
      ))}
    </g>
  );
};

// Greedy word wrap by character count (good enough for the fixed card fonts)
const wrap = (text: string, max: number): string[] =>
  text.split(' ').reduce<string[]>((lines, word) => {
    const last = lines[lines.length - 1];
    if (last !== undefined && `${last} ${word}`.length <= max) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
    return lines;
  }, []);

// Code-39-looking bars derived from the code: thin/wide bars and gaps, start and end guards
const Barcode = ({ value, x, y, width, height }: { value: string; x: number; y: number; width: number; height: number }): JSX.Element => {
  const pattern = [
    2,
    1,
    1,
    2,
    ...[...value].flatMap((char) => {
      const code = char.charCodeAt(0);
      return [1 + (code % 2), 1, 1 + ((code >> 1) % 2), 1, 1 + ((code >> 2) % 2), 2];
    }),
    2,
    1,
    1,
    2,
  ];
  const total = pattern.reduce((sum, unit) => sum + unit, 0);
  const unit = width / total;
  let cursor = x;
  return (
    <g fill={color.ink}>
      {pattern.map((size, index): JSX.Element | null => {
        const bar = index % 2 === 0;
        const rect = bar ? <rect key={index} x={cursor} y={y} width={size * unit} height={height} /> : null;
        cursor += size * unit;
        return rect;
      })}
    </g>
  );
};

// Hand-signature squiggle over the signatory line
const Signature = ({ x, y, width }: { x: number; y: number; width: number }): JSX.Element => <path d={`M${x} ${y} c${width * 0.08} -3 ${width * 0.16} -3.4 ${width * 0.2} -0.6 s${width * 0.06} 2.6 ${width * 0.14} -0.4 s${width * 0.1} -3 ${width * 0.16} 0.2 s${width * 0.12} 1.6 ${width * 0.2} -1.4 s${width * 0.1} 0.8 ${width * 0.18} 0.6`} fill="none" stroke={color.ink} strokeWidth="0.35" strokeLinecap="round" />;

// Photo frame: the person's photo when there is one, a silhouette otherwise
const Photo = ({ cardholder, x, y, width, height, clipId }: { cardholder: Cardholder; x: number; y: number; width: number; height: number; clipId: string }): JSX.Element => (
  <g>
    <clipPath id={clipId}>
      <rect x={x} y={y} width={width} height={height} rx="1.6" />
    </clipPath>
    <rect x={x} y={y} width={width} height={height} rx="1.6" fill={color.surface} stroke={color.line} strokeWidth="0.25" />
    {cardholder.photoUrl ? (
      <image href={cardholder.photoUrl} x={x} y={y} width={width} height={height} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} />
    ) : (
      <g clipPath={`url(#${clipId})`} fill={color.line}>
        <circle cx={x + width / 2} cy={y + height * 0.38} r={width * 0.22} />
        <ellipse cx={x + width / 2} cy={y + height * 1.02} rx={width * 0.46} ry={height * 0.36} />
      </g>
    )}
  </g>
);

// Back of the card: usage terms, what to do if found, emergency contact, signature, barcode and the institution's contact
const CardBack = ({ cardholder, issuer, format }: Pick<IdCardSvgProps, 'cardholder' | 'issuer' | 'format'>): JSX.Element => {
  const { widthMm: w, heightMm: h } = cardFormats[format];
  const holder = cardholder.group === 'students' ? (issuer.institutionType === 'CEPRE' ? 'alumno' : 'estudiante') : 'miembro del personal';
  const terms = `Este carnet es personal e intransferible y acredita a su titular como ${holder} de ${issuer.institutionName} durante ${issuer.validity}.`;
  const found = `Si lo encuentras, devuélvelo en secretaría o llama al ${issuer.phone}.`;
  const emergencyLabel = cardholder.group === 'students' ? 'Contacto de emergencia' : 'En caso de emergencia';

  if (format === 'carnet') {
    const termLines = wrap(terms, 44);
    const foundLines = wrap(found, 44);
    return (
      <>
        <rect width={w} height="3" fill={color.brand} />
        {termLines.map((line, index): JSX.Element => (
          <text key={line} x="4" y={8.4 + index * 2.9} fontSize="2.05" fill={color.ink}>
            {line}
          </text>
        ))}
        {foundLines.map((line, index): JSX.Element => (
          <text key={line} x="4" y={8.8 + (termLines.length + index) * 2.9} fontSize="2.05" fill={color.muted}>
            {line}
          </text>
        ))}
        <text x="4" y="29.4" fontSize="1.8" fontWeight="600" fill={color.brand}>
          {emergencyLabel}
        </text>
        <text x="4" y="32.6" fontSize="2.3" fontWeight="600" fill={color.ink}>
          {cardholder.emergencyName}
        </text>
        <text x="4" y="35.8" fontSize="2.2" fontFamily={MONO} fill={color.ink}>
          {cardholder.emergencyPhone}
        </text>

        <Signature x={w - 26} y={30} width={22} />
        <line x1={w - 27} y1="33.4" x2={w - 4} y2="33.4" stroke={color.ink} strokeWidth="0.25" />
        <text x={w - 15.5} y="36.4" fontSize="1.8" fill={color.muted} textAnchor="middle">
          {issuer.signatory}
        </text>

        <Barcode value={cardholder.code} x={4} y={39.4} width={44} height={6} />
        <text x="26" y="48.2" fontSize="1.9" fontFamily={MONO} fill={color.ink} textAnchor="middle" letterSpacing="0.4">
          {cardholder.code}
        </text>
        <text x={w - 4} y="44.2" fontSize="1.75" fill={color.muted} textAnchor="end">
          {issuer.address}
        </text>
        <text x={w - 4} y="47.2" fontSize="1.75" fill={color.muted} textAnchor="end">
          {issuer.website} · {issuer.phone}
        </text>
        <rect y={h - 3} width={w} height="3" fill={color.brand} />
      </>
    );
  }

  const termLines = wrap(terms, 34);
  const foundLines = wrap(found, 34);
  const foundTop = 19.4 + termLines.length * 3;
  return (
    <>
      <rect width={w} height="10" fill={color.brand} />
      <rect x={w / 2 - 6.5} y="3.2" width="13" height="2.8" rx="1.4" fill={color.paper} fillOpacity="0.9" />
      <text x={w / 2} y="16" fontSize="2.3" fontWeight="700" fill={color.ink} textAnchor="middle">
        {issuer.institutionName.length > 30 ? `${issuer.institutionName.slice(0, 29)}…` : issuer.institutionName}
      </text>
      {termLines.map((line, index): JSX.Element => (
        <text key={line} x={w / 2} y={20.6 + index * 3} fontSize="2" fill={color.ink} textAnchor="middle">
          {line}
        </text>
      ))}
      {foundLines.map((line, index): JSX.Element => (
        <text key={line} x={w / 2} y={foundTop + 2.2 + index * 3} fontSize="2" fill={color.muted} textAnchor="middle">
          {line}
        </text>
      ))}

      <rect x="4.5" y="44" width={w - 9} height="12.4" rx="1.6" fill={color.surface} />
      <text x={w / 2} y="47.8" fontSize="1.8" fontWeight="600" fill={color.brand} textAnchor="middle">
        {emergencyLabel}
      </text>
      <text x={w / 2} y="51" fontSize="2.2" fontWeight="600" fill={color.ink} textAnchor="middle">
        {cardholder.emergencyName}
      </text>
      <text x={w / 2} y="54.3" fontSize="2.1" fontFamily={MONO} fill={color.ink} textAnchor="middle">
        {cardholder.emergencyPhone}
      </text>

      <Signature x={w / 2 - 11} y={62.6} width={22} />
      <line x1={w / 2 - 12} y1="65.6" x2={w / 2 + 12} y2="65.6" stroke={color.ink} strokeWidth="0.25" />
      <text x={w / 2} y="68.4" fontSize="1.8" fill={color.muted} textAnchor="middle">
        {issuer.signatory}
      </text>

      <Barcode value={cardholder.code} x={7} y={71} width={w - 14} height={5.4} />
      <text x={w / 2} y="79.3" fontSize="1.9" fontFamily={MONO} fill={color.ink} textAnchor="middle" letterSpacing="0.4">
        {cardholder.code}
      </text>
      <text x={w / 2} y="82.3" fontSize="1.6" fill={color.muted} textAnchor="middle">
        {issuer.website} · {issuer.phone}
      </text>
      <rect y={h - 1.6} width={w} height="1.6" fill={color.brand} />
    </>
  );
};

// Printable ID card as an SVG in millimetres (viewBox = physical size): carnet (landscape) or fotocheck (portrait), front or back
export const IdCardSvg = ({ cardholder, issuer, format, side = 'front', idPrefix = 'card', svgRef, className }: IdCardSvgProps): JSX.Element => {
  const { widthMm: w, heightMm: h } = cardFormats[format];
  const kind = cardholder.group === 'students' ? (issuer.institutionType === 'CEPRE' ? 'Alumno' : 'Estudiante') : 'Personal';
  const title = cardholder.group === 'students' ? 'Carnet de estudiante' : 'Fotocheck del personal';
  const id = `${idPrefix}-${format}-${side}-${cardholder.id}`;

  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${w} ${h}`} width={`${w}mm`} height={`${h}mm`} role="img" aria-label={`${cardFormats[format].label} de ${cardholder.name}, cara ${side === 'front' ? 'frontal' : 'posterior'}`} className={className} fontFamily={FONT}>
      <clipPath id={`${id}-card`}>
        <rect width={w} height={h} rx="3.2" />
      </clipPath>
      <g clipPath={`url(#${id}-card)`}>
        <rect width={w} height={h} fill={color.paper} />

        {side === 'back' ? (
          <CardBack cardholder={cardholder} issuer={issuer} format={format} />
        ) : format === 'carnet' ? (
          <>
            <rect width={w} height="12.5" fill={color.brand} />
            <rect x="3.6" y="2.4" width="7.7" height="7.7" rx="1.6" fill={color.paper} />
            <image href="/logo.png" x="4" y="2.8" width="6.9" height="6.9" />
            <text x="13.4" y="6.3" fontSize="3" fontWeight="700" fill={color.paper}>
              {issuer.institutionName}
            </text>
            <text x="13.4" y="9.4" fontSize="2" fill={color.paper} fillOpacity="0.85">
              {title}
            </text>
            <rect x={w - 20.5} y="3.9" width="17" height="4.6" rx="2.3" fill={color.paper} fillOpacity="0.18" />
            <text x={w - 12} y="7" fontSize="2.1" fontWeight="600" fill={color.paper} textAnchor="middle">
              {kind}
            </text>

            <Photo cardholder={cardholder} x={4} y={16} width={21} height={27} clipId={`${id}-photo`} />

            {nameLines(cardholder.name, 24).map((line, index): JSX.Element => (
              <text key={line} x="29" y={20.4 + index * 4} fontSize="3.5" fontWeight="700" fill={color.ink}>
                {line}
              </text>
            ))}
            <text x="29" y={nameLines(cardholder.name, 24).length > 1 ? 29.2 : 25.4} fontSize="2.5" fill={color.muted}>
              {cardholder.detail}
            </text>
            <text x="29" y="35" fontSize="1.9" fill={color.muted}>
              Código
            </text>
            <text x="29" y="38.6" fontSize="2.9" fontWeight="600" fontFamily={MONO} fill={color.ink}>
              {cardholder.code}
            </text>
            <text x="47" y="35" fontSize="1.9" fill={color.muted}>
              DNI
            </text>
            <text x="47" y="38.6" fontSize="2.9" fontWeight="600" fontFamily={MONO} fill={color.ink}>
              {cardholder.documentNumber}
            </text>
            <Qr seed={cardholder.code} qr={cardholder.qr} x={w - 19.5} y={h - 25} size={15.5} />
            <line x1="4" y1={h - 6.6} x2={w - 22} y2={h - 6.6} stroke={color.line} strokeWidth="0.25" />
            <text x="4" y={h - 3.2} fontSize="2" fill={color.muted}>
              Vigencia {issuer.validity} · Muestra el QR al ingresar
            </text>
          </>
        ) : (
          <>
            <rect width={w} height="23" fill={color.brand} />
            <rect x={w / 2 - 6.5} y="3.2" width="13" height="2.8" rx="1.4" fill={color.paper} fillOpacity="0.9" />
            <rect x="4.5" y="9.6" width="8.6" height="8.6" rx="1.8" fill={color.paper} />
            <image href="/logo.png" x="5" y="10.1" width="7.6" height="7.6" />
            <text x="15.6" y="13.6" fontSize="2.7" fontWeight="700" fill={color.paper}>
              {issuer.institutionName.length > 26 ? `${issuer.institutionName.slice(0, 25)}…` : issuer.institutionName}
            </text>
            <text x="15.6" y="16.7" fontSize="1.9" fill={color.paper} fillOpacity="0.85">
              {title}
            </text>

            <Photo cardholder={cardholder} x={w / 2 - 12} y={27} width={24} height={30} clipId={`${id}-photo`} />
            <rect x={w / 2 - 9} y="54.6" width="18" height="4.4" rx="2.2" fill={color.brand} />
            <text x={w / 2} y="57.6" fontSize="2.1" fontWeight="600" fill={color.paper} textAnchor="middle">
              {kind}
            </text>

            {nameLines(cardholder.name, 24).map((line, index): JSX.Element => (
              <text key={line} x={w / 2} y={63.4 + index * 3.8} fontSize="3.2" fontWeight="700" fill={color.ink} textAnchor="middle">
                {line}
              </text>
            ))}
            <text x={w / 2} y={nameLines(cardholder.name, 24).length > 1 ? 71.4 : 67.6} fontSize="2.3" fill={color.muted} textAnchor="middle">
              {cardholder.detail}
            </text>

            <text x="4.5" y={h - 9.4} fontSize="1.8" fill={color.muted}>
              Código · DNI
            </text>
            <text x="4.5" y={h - 6.2} fontSize="2.5" fontWeight="600" fontFamily={MONO} fill={color.ink}>
              {cardholder.code}
            </text>
            <text x="4.5" y={h - 3.2} fontSize="2.3" fontFamily={MONO} fill={color.muted}>
              {cardholder.documentNumber}
            </text>
            <Qr seed={cardholder.code} qr={cardholder.qr} x={w - 15.5} y={h - 14.6} size={11.6} />
            <rect y={h - 1.6} width={w} height="1.6" fill={color.brand} />
          </>
        )}
      </g>
      <rect x="0.12" y="0.12" width={w - 0.24} height={h - 0.24} rx="3.1" fill="none" stroke={color.line} strokeWidth="0.24" />
    </svg>
  );
};
