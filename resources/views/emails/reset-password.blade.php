<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f4f6f9;
      color: #333;
    }
    .wrapper {
      max-width: 560px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .header {
      background-color: #0d6efd;
      padding: 36px 40px;
      text-align: center;
    }
    .logo-circle {
      width: 64px;
      height: 64px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }
    .header h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 2px;
    }
    .header p {
      color: rgba(255,255,255,0.8);
      font-size: 14px;
      margin-top: 4px;
    }
    .body { padding: 40px; }
    .body h2 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #1a1a2e;
    }
    .body p {
      font-size: 15px;
      line-height: 1.7;
      color: #555;
      margin-bottom: 16px;
    }
    .btn-wrapper { text-align: center; margin: 32px 0; }
    .btn {
      display: inline-block;
      background-color: #0d6efd;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
    }
    .divider {
      border: none;
      border-top: 1px solid #eee;
      margin: 24px 0;
    }
    .small {
      font-size: 13px;
      color: #999;
      line-height: 1.6;
    }
    .small a {
      color: #0d6efd;
      word-break: break-all;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 24px 40px;
      text-align: center;
      font-size: 13px;
      color: #aaa;
    }
    .footer strong { color: #0d6efd; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo-circle">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
          fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
          <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
          <circle cx="20" cy="10" r="2"/>
        </svg>
      </div>
      <h1>TABIBI</h1>
      <p>Your trusted healthcare platform</p>
    </div>

    <div class="body">
      <h2>Hello, {{ $name }}</h2>
      <p>
        We received a request to reset your <strong>TABIBI</strong> account password.
        Click the button below to set a new password.
      </p>
      <p>This link will expire in <strong>60 minutes</strong>.</p>

      <div class="btn-wrapper">
        <a href="{{ $url }}" class="btn">Reset Password</a>
      </div>

      <hr class="divider" />

      <p class="small">
        If you did not request a password reset, no further action is required.
      </p>
      <p class="small">
        If the button does not work, copy and paste the link below into your browser:
        <br />
        <a href="{{ $url }}">{{ $url }}</a>
      </p>
    </div>

    <div class="footer">
      &copy; {{ date('Y') }} <strong>TABIBI</strong>. All rights reserved.
    </div>
  </div>
</body>
</html>