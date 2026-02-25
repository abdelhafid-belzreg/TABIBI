<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email</title>
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
    .header h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .header p {
      color: rgba(255,255,255,0.8);
      font-size: 14px;
      margin-top: 4px;
    }
    .body {
      padding: 40px;
    }
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
    .btn-wrapper {
      text-align: center;
      margin: 32px 0;
    }
    .btn {
      display: inline-block;
      background-color: #0d6efd;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.3px;
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
    .footer strong {
      color: #0d6efd;
    }
  </style>
</head>
<body>
  <div class="wrapper">

    <!-- Header -->
    <div class="header">
      <h1>TABIBI</h1>
      <p>Your trusted healthcare platform</p>
    </div>

    <!-- Body -->
    <div class="body">
      <h2>Hello, {{ $name }}</h2>
      <p>
        Thank you for creating an account on <strong>TABIBI</strong>.
        Please verify your email address to activate your account and start using our platform.
      </p>
      <p>This link will expire in <strong>60 minutes</strong>.</p>

      <div class="btn-wrapper">
        <a href="{{ $url }}" class="btn">Verify Email Address</a>
      </div>

      <hr class="divider" />

      <p class="small">
        If you did not create an account, no further action is required.
      </p>
      <p class="small">
        If the button does not work, copy and paste the link below into your browser:
        <br />
        <a href="{{ $url }}">{{ $url }}</a>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      &copy; {{ date('Y') }} <strong>TABIBI</strong>. All rights reserved.
    </div>

  </div>
</body>
</html>