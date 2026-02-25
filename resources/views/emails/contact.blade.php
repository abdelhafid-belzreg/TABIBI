<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Message</title>
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
    .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 2px; }
    .header p  { color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 4px; }
    .body      { padding: 40px; }
    .body h2   { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #1a1a2e; }
    .field     { margin-bottom: 16px; }
    .label     { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #999; margin-bottom: 4px; }
    .value     { font-size: 15px; color: #333; background: #f8f9fa; padding: 10px 14px; border-radius: 8px; line-height: 1.6; }
    .divider   { border: none; border-top: 1px solid #eee; margin: 24px 0; }
    .footer    { background-color: #f8f9fa; padding: 24px 40px; text-align: center; font-size: 13px; color: #aaa; }
    .footer strong { color: #0d6efd; }
  </style>
</head>
<body>
  <div class="wrapper">

    <div class="header">
      
      <h1>TABIBI</h1>
      <p>New Contact Message</p>
    </div>

    <div class="body">
      <h2>You received a new message</h2>

      <div class="field">
        <div class="label">From</div>
        <div class="value">{{ $name }}</div>
      </div>

      <div class="field">
        <div class="label">Email</div>
        <div class="value">
          <a href="mailto:{{ $email }}" style="color: #0d6efd; text-decoration: none;">{{ $email }}</a>
        </div>
      </div>

      <div class="field">
        <div class="label">Subject</div>
        <div class="value">{{ $subject }}</div>
      </div>

      <div class="field">
        <div class="label">Message</div>
        <div class="value">{{ $msg }}</div>
      </div>

      <hr class="divider" />

      <p style="font-size: 13px; color: #999;">
        You can reply directly to this email to respond to {{ $name }}.
      </p>
    </div>

    <div class="footer">
      &copy; {{ date('Y') }} <strong>TABIBI</strong>. All rights reserved.
    </div>

  </div>
</body>
</html>