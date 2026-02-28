import 'dotenv/config';
import { flightTracker, Flight, FlightAlert } from './sources/flights';
import { telegramAlerter } from './alerts/telegram';

/**
 * 🦀 CLAWDWATCH
 * The all-seeing OSINT agent
 */

const LOGO = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     ██████╗██╗      █████╗ ██╗    ██╗██████╗              ║
║    ██╔════╝██║     ██╔══██╗██║    ██║██╔══██╗             ║
║    ██║     ██║     ███████║██║ █╗ ██║██║  ██║             ║
║    ██║     ██║     ██╔══██║██║███╗██║██║  ██║             ║
║    ╚██████╗███████╗██║  ██║╚███╔███╔╝██████╔╝             ║
║     ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═════╝              ║
║                    WATCH                                   ║
║                                                           ║
║        🦀 The All-Seeing OSINT Agent 🦀                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`;

function printHeader() {
  console.clear();
  console.log(LOGO);
}

function printStatus(message: string) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${message}`);
}

function printFlight(flight: Flight, isMilitary: boolean = false) {
  const icon = isMilitary ? '🎖️ ' : '✈️ ';
  const alt = Math.round(flight.altitude).toLocaleString();
  const spd = String(Math.round(flight.speed));
  console.log(`  ${icon} ${flight.callsign.padEnd(10)} | ${alt.padStart(7)}ft | ${spd.padStart(4)}kts | ${flight.origin || 'N/A'}`);
}

function printAlert(alert: FlightAlert) {
  const time = alert.timestamp.toLocaleTimeString();
  const icon = alert.type === 'emergency' ? '🚨' : alert.type === 'military' ? '🎖️ ' : '⚠️ ';
  console.log(`\n${icon} [${time}] ALERT: ${alert.message}`);
}

let region: 'middle_east' | 'europe' | 'usa' | 'asia' = 'middle_east';

async function monitorFlights() {
  printStatus(`Fetching flights for ${region.toUpperCase()}...`);
  
  const flights = await flightTracker.getRegion(region);
  
  if (flights.length === 0) {
    printStatus('No flights received (API may be rate limited, retrying in 30s...)');
    return;
  }

  // Analyze for alerts
  const alerts = flightTracker.analyze(flights);
  
  // Print and send alerts
  for (const alert of alerts) {
    printAlert(alert);
    if (telegramAlerter.isEnabled()) {
      await telegramAlerter.sendFlightAlert(alert);
    }
  }

  // Filter military flights
  const militaryFlights = flights.filter(f => flightTracker.isMilitary(f));
  const emergencyFlights = flights.filter(f => flightTracker.isEmergency(f));

  console.log(`\n📡 LIVE FLIGHT DATA — ${region.toUpperCase()}`);
  console.log('─'.repeat(60));
  console.log(`  Total: ${flights.length} | Military: ${militaryFlights.length} | Emergency: ${emergencyFlights.length}`);
  
  if (telegramAlerter.isEnabled()) {
    console.log(`  Telegram: ✅ Connected`);
  }
  
  console.log('─'.repeat(60));

  // Show military flights
  if (militaryFlights.length > 0) {
    console.log('\n🎖️  MILITARY AIRCRAFT:');
    militaryFlights.slice(0, 10).forEach(f => printFlight(f, true));
  }

  // Show emergency flights
  if (emergencyFlights.length > 0) {
    console.log('\n🚨 EMERGENCY SQUAWKS:');
    emergencyFlights.forEach(f => printFlight(f));
  }

  // Show some active flights
  const activeFlights = flights
    .filter(f => f.altitude > 10000 && !flightTracker.isMilitary(f) && f.speed > 200)
    .sort((a, b) => b.altitude - a.altitude)
    .slice(0, 8);
  
  if (activeFlights.length > 0) {
    console.log('\n✈️  ACTIVE FLIGHTS (by altitude):');
    activeFlights.forEach(f => printFlight(f));
  }

  console.log('\n' + '─'.repeat(60));
  printStatus(`Next update in 30 seconds...`);
}

async function main() {
  printHeader();
  console.log('🦀 Initializing Clawdwatch...\n');

  // Get region from env or default to middle_east
  region = (process.env.WATCH_REGION || 'middle_east') as typeof region;
  
  printStatus(`Monitoring region: ${region.toUpperCase()}`);
  printStatus('Connecting to OpenSky Network...');
  
  // Telegram status
  if (telegramAlerter.isEnabled()) {
    printStatus('Telegram alerts: ✅ Enabled');
    await telegramAlerter.sendStartup(region);
  } else {
    printStatus('Telegram alerts: ❌ Not configured (set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID)');
  }
  
  // Initial fetch
  await monitorFlights();

  // Update every 30 seconds
  setInterval(() => {
    monitorFlights();
  }, 30000);
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🦀 Clawdwatch shutting down...');
  if (telegramAlerter.isEnabled()) {
    await telegramAlerter.send('🦀 Clawdwatch going offline.');
  }
  process.exit(0);
});

main().catch(console.error);
