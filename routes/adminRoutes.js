const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= INVENTORY ================= */
router.get("/inventory", (req, res) => {
  db.query("SELECT * FROM inventory", (err, result) => {
    res.json(result);
  });
});

/* ================= APPROVE REQUEST ================= */
router.post("/approve", (req, res) => {
  const { request_id, blood_group, quantity } = req.body;

  // Check available stock first
  db.query(
    "SELECT quantity FROM inventory WHERE blood_group=?",
    [blood_group],
    (err, result) => {
      if (result.length === 0) {
        return res.send("Blood group not available in inventory");
      }

      if (result[0].quantity < quantity) {
        return res.send("Not enough stock available");
      }

      // Update request status
      db.query(
        "UPDATE requests SET status='Approved' WHERE request_id=?",
        [request_id]
      );

      // Deduct inventory
      db.query(
        "UPDATE inventory SET quantity = quantity - ? WHERE blood_group=?",
        [quantity, blood_group],
        () => {
          res.send("Request Approved & Inventory Updated");
        }
      );
    }
  );
});

/* ================= ANALYTICS ================= */
router.get("/analytics", (req, res) => {
  db.query("SELECT blood_group, quantity FROM inventory", (err, stock) => {
    db.query(
      "SELECT COUNT(*) AS total_donations FROM donations",
      (err2, don) => {
        db.query(
          "SELECT COUNT(*) AS total_requests FROM requests",
          (err3, req) => {
            res.json({
              stock,
              donations: don[0].total_donations,
              requests: req[0].total_requests,
            });
          }
        );
      }
    );
  });
});

/* ================= FULL DATA (DONATIONS + REQUESTS WITH JOIN) ================= */
router.get("/full-data", (req, res) => {
  db.query(
    `SELECT d.donation_id, u.name, u.email, d.quantity, d.blood_group, d.donation_date
     FROM donations d
     JOIN users u ON d.donor_id = u.user_id`,
    (err, donations) => {
      db.query(
        `SELECT r.request_id, u.name, u.email, r.blood_group, r.quantity, r.status
         FROM requests r
         JOIN users u ON r.hospital_id = u.user_id`,
        (err2, requests) => {
          res.json({ donations, requests });
        }
      );
    }
  );
});

module.exports = router;