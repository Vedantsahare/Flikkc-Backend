import ContestEntry from "../models/ContestEntry.js";

export default async function detectCollusion(contestId) {

  const entries = await ContestEntry.find({ contestId });

  const deviceMap = {};
  const ipMap = {};

  for (const entry of entries) {

    if (!deviceMap[entry.deviceFingerprint]) {
      deviceMap[entry.deviceFingerprint] = [];
    }

    deviceMap[entry.deviceFingerprint].push(entry.userId);

    if (!ipMap[entry.ip]) {
      ipMap[entry.ip] = [];
    }

    ipMap[entry.ip].push(entry.userId);

  }

  const suspiciousUsers = new Set();

  Object.values(deviceMap).forEach(users => {

    if (users.length > 3) {
      users.forEach(u => suspiciousUsers.add(u));
    }

  });

  Object.values(ipMap).forEach(users => {

    if (users.length > 3) {
      users.forEach(u => suspiciousUsers.add(u));
    }

  });

  return Array.from(suspiciousUsers);

}