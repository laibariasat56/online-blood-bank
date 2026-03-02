const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= REGISTER ================= */
router.post("/register", (req, res) => {
  const { name, email, phone, password, role, blood_group, address } = req.body;

  const sql = `
    INSERT INTO users (name,email,phone,password,role,blood_group,address)
    VALUES (?,?,?,?,?,?,?)
  `;

  db.query(sql, [name,email,phone,password,role,blood_group,address], (err) => {
    if(err) return res.send("User already exists");
    res.send("Registration Successful");
  });
});

/* ================= LOGIN ================= */
router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=? AND role=?";

  db.query(sql, [email,password,role], (err,result)=>{
    if(result.length>0)
      res.json({success:true,user:result[0]});
    else
      res.json({success:false});
  });
});

/* ================= DONATE BLOOD ================= */
router.post("/donate", (req,res)=>{
  const donor_id = req.body.donor_id;
  const quantity = parseInt(req.body.quantity);
  const blood_group = req.body.blood_group.toLowerCase();

  // 1️⃣ Insert donation
  db.query(
    "INSERT INTO donations (donor_id,quantity,blood_group,donation_date) VALUES (?,?,?,CURDATE())",
    [donor_id,quantity,blood_group],
    (err)=>{
      if(err) return res.send("Donation Insert Error");

      // 2️⃣ Check inventory exists
      db.query(
        "SELECT * FROM inventory WHERE blood_group=?",
        [blood_group],
        (err,result)=>{

          if(result.length > 0){
            // update
            db.query(
              "UPDATE inventory SET quantity = quantity + ? WHERE blood_group=?",
              [quantity,blood_group],
              ()=> res.send("Donation Added & Inventory Updated")
            );
          } else {
            // insert new
            db.query(
              "INSERT INTO inventory (blood_group,quantity,expiry_date) VALUES (?,?,DATE_ADD(CURDATE(), INTERVAL 30 DAY))",
              [blood_group,quantity],
              ()=> res.send("Donation Added & Inventory Created")
            );
          }
        }
      );
    }
  );
});
/* ================= REQUEST BLOOD ================= */
router.post("/request", (req,res)=>{
  const { hospital_id, blood_group, quantity } = req.body;

  db.query(
    "INSERT INTO requests (hospital_id,blood_group,quantity,request_date) VALUES (?,?,?,CURDATE())",
    [hospital_id,blood_group,quantity]
  );

  res.send("Request Submitted");
});

/* ================= GET NOTIFICATIONS ================= */
router.get("/notifications/:role",(req,res)=>{
  const role = req.params.role;
  db.query(
    "SELECT * FROM notifications WHERE target_role=? OR target_role='all' ORDER BY created_at DESC",
    [role],
    (err,result)=> res.json(result)
  );
});

module.exports = router;