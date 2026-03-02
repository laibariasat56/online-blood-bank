const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= INVENTORY ================= */
router.get("/inventory",(req,res)=>{
  db.query("SELECT * FROM inventory",(err,result)=>{
    res.json(result);
  });
});

router.post("/inventory",(req,res)=>{
  const { blood_group, quantity, expiry_date } = req.body;

  db.query(
    "INSERT INTO inventory (blood_group,quantity,expiry_date) VALUES (?,?,?)",
    [blood_group,quantity,expiry_date],
    ()=> res.send("Inventory Added")
  );
});

/* ================= REQUEST MANAGEMENT ================= */
router.get("/requests",(req,res)=>{
  db.query("SELECT * FROM requests",(err,result)=> res.json(result));
});

router.post("/approve",(req,res)=>{
  const { request_id, blood_group, quantity } = req.body;

  db.query("UPDATE requests SET status='Approved' WHERE request_id=?",[request_id]);

  db.query(
    "UPDATE inventory SET quantity=quantity-? WHERE blood_group=?",
    [quantity,blood_group]
  );

  res.send("Request Approved");
});

/* ================= ANALYTICS ================= */
router.get("/analytics",(req,res)=>{
  db.query("SELECT blood_group,quantity FROM inventory",(err,stock)=>{
    db.query("SELECT COUNT(*) AS total_donations FROM donations",(err2,don)=>{
      db.query("SELECT COUNT(*) AS total_requests FROM requests",(err3,req)=>{
        res.json({
          stock,
          donations: don[0].total_donations,
          requests: req[0].total_requests
        });
      });
    });
  });
});

/* ================= CAMPS ================= */
router.post("/camp",(req,res)=>{
  const { camp_name, location, camp_date } = req.body;

  db.query(
    "INSERT INTO camps (camp_name,location,camp_date) VALUES (?,?,?)",
    [camp_name,location,camp_date]
  );

  db.query(
    "INSERT INTO notifications (message,target_role) VALUES (?, 'donor')",
    [`New Blood Camp: ${camp_name} at ${location} on ${camp_date}`]
  );

  res.send("Camp Scheduled");
});

module.exports = router;