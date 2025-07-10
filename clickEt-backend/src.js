// function revertExpiredHolds() {
//   // 1) Find screenings that might have expired holds
//   // If you have thousands of screenings, do them in batches or keep track of "active" ones
//   const now = new Date();

//   Screening.find({ startTime: { $gte: new Date() } }) // only upcoming shows
//     .cursor() // stream through docs if large
//     .eachAsync(async (screening) => {
//       let hasChanges = false;
//       for (let r = 0; r < screening.seatGrid.length; r++) {
//         for (let c = 0; c < screening.seatGrid[r].length; c++) {
//           const seat = screening.seatGrid[r][c];
//           if (
//             seat.code === "h" &&
//             seat.holdExpiresAt &&
//             seat.holdExpiresAt < now
//           ) {
//             seat.code = "a";
//             seat.holdExpiresAt = null;
//             hasChanges = true;
//           }
//         }
//       }
//       if (hasChanges) {
//         await screening.save();
//       }
//     })
//     .then(() => {
//       console.log("Done reverting expired holds");
//     })
//     .catch(console.error);
// }