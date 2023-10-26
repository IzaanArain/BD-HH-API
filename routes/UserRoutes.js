const express = require("express");
const {
  signup,
  otp_verfy,
  login,
  forgot_password,
  reset_password,
  complete_profile,
  change_password,
  delete_profile
} = require("../controller/UserController");
const { user_validate_token } = require("../middleware/Auth");
const { upload } = require("../middleware/Multer");
const { create_job_post, get_job_post, assign_job, employee_job_posts, employer_job_posts, accept_job, get_accepted_posts, edit_job_post, apply_job, job_posts_applicants, job_applicants } = require("../controller/JobPostController");
const { checkUserRole } = require("../middleware/AuthorizeRole");
const { error_handler } = require("../middleware/ErrorHandler");
const { rate_review_employee, employee_rate_reviews } = require("../controller/RateReviewController");
const router = express.Router();

// user routes
router.post("/signup", signup);
router.post("/otp_verify", otp_verfy);
router.post("/login", login);
router.post("/forgot_password", forgot_password);
router.post("/reset_password", reset_password);
router.post("/complete_profile", user_validate_token,upload.fields([{name:'profile_image'},{name:'company_image'}]),error_handler, complete_profile);
router.post("/change_password", user_validate_token, change_password);
router.post("/delete_profile", user_validate_token,delete_profile);
// employer job routes
router.post("/create_job_post", user_validate_token,checkUserRole("employer"),upload.fields([{name:"post_image"}]),error_handler,create_job_post);
router.post("/assign_job", user_validate_token,checkUserRole("employer"),assign_job);
router.get("/get_job_post", user_validate_token,checkUserRole("employer"),get_job_post);
router.get("/employer_job_posts", user_validate_token,checkUserRole("employer"),employer_job_posts);
router.put("/edit_job_post", user_validate_token,checkUserRole("employer"),upload.fields([{name:"post_image"}]),error_handler,edit_job_post);
// employee job routes
router.post("/accept_job", user_validate_token,checkUserRole("employee"),accept_job);
router.get("/employee_job_posts", user_validate_token,checkUserRole("employee"),employee_job_posts);
router.get("/all_accepted_posts", user_validate_token,checkUserRole("employee"),get_accepted_posts);
// employee apply job routes
router.post("/apply_job",user_validate_token,checkUserRole("employee"),apply_job);
// employer apply job routes
router.get("/job_posts_applicants",user_validate_token,checkUserRole("employer"),job_posts_applicants);
router.get("/job_applicants",user_validate_token,checkUserRole("employer"),job_applicants);
// rate & review employee by employer
router.post("/rate_review_employee",user_validate_token,checkUserRole("employer"),rate_review_employee);
router.get("/employee_rate_reviews",user_validate_token,checkUserRole("employer"),employee_rate_reviews);



module.exports = router;
