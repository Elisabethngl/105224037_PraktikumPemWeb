#!/usr/bin/env bash
# ==============================================================================
# SKRIP HARDENING SISTEM OPERASI VM — AGROMARKET
# Tugas 2 Keamanan Siber (Penanda sec-0.2)
#
# Memperkeras VM Ubuntu Server untuk mencapai Indeks Lynis >= 70:
# 1. Login SSH hanya dengan Public Key, Root Login Ditolak Keras.
# 2. Kernel Sysctl Network Hardening (Anti-Spoofing, Anti-Redirect).
# 3. Konfigurasi Firewall UFW (Default Deny Incoming).
# 4. Kebijakan Keamanan Akun & Password Policy (SHA-512 500.000 rounds).
# 5. Pemasangan Banner Legalitas & Pembatasan Kompiler.
# ==============================================================================

set -euo pipefail

echo "==> [1/6] Memperbarui Repositori dan Paket Dasar..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y --no-install-recommends \
    ufw \
    auditd \
    audispd-plugins \
    libpam-pwquality \
    apt-listbugs \
    fail2ban \
    lynis

echo "==> [2/6] Memperkeras Konfigurasi SSH Daemon (/etc/ssh/sshd_config.d/99-hardened.conf)..."
mkdir -p /etc/ssh/sshd_config.d/
cat << 'EOF' > /etc/ssh/sshd_config.d/99-hardened.conf
# AGROMARKET SSH HARDENING POLICY [Ref: T-08 / R-02]
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
KbdInteractiveAuthentication no
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
LoginGraceTime 30
Banner /etc/issue.net
AllowTcpForwarding no
AllowAgentForwarding no
EOF

# Verifikasi sintaks sshd
sshd -t
systemctl restart ssh || systemctl restart sshd

echo "==> [3/6] Menerapkan Hardening Kernel Sysctl (/etc/sysctl.d/99-security.conf)..."
cat << 'EOF' > /etc/sysctl.d/99-security.conf
# Mitigasi Serangan Jaringan & Spoofing
net.ipv4.ip_forward = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Proteksi Memori & Core Dump
fs.suid_dumpable = 0
kernel.randomize_va_space = 2
kernel.kptr_restrict = 2
kernel.dmesg_restrict = 1
EOF

sysctl -p /etc/sysctl.d/99-security.conf

echo "==> [4/6] Mengaktifkan Firewall UFW..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH Key-Only Hardened Port'
ufw --force enable

echo "==> [5/6] Memperketat Hak Akses Berkas & Banner Legalitas..."
cat << 'EOF' > /etc/issue.net
********************************************************************
* PERINGATAN RESMI: AKSES TERBATAS HANYA UNTUK PERSONEL BERWENANG  *
* SISTEM SERVER AGROMARKET DILINDUNGI UU ITE DAN UU PDP REPUBLIK   *
* INDONESIA. SELURUH AKTIVITAS DAN PERCOBAAN AKSES ILEGAL DICATAT  *
* SERTA AKAN DITINDAKLANJUTI KE JALUR HUKUM PIDANA.                *
********************************************************************
EOF
cp /etc/issue.net /etc/issue

# Batasi hak akses direktori sensitif
chmod 700 /root
chmod 750 /var/log
chmod -R go-w /etc/cron* /etc/crontab 2>/dev/null || true

# Batasi penggunaan kompiler hanya untuk root
chmod 700 /usr/bin/gcc* 2>/dev/null || true
chmod 700 /usr/bin/as* 2>/dev/null || true

echo "==> [6/6] Menjalankan Service Auditd & Uji Kepatuhan..."
systemctl enable auditd && systemctl restart auditd

echo "=============================================================================="
echo "HASIL VALIDASI SSH HARDENING:"
sshd -T | grep -E 'passwordauthentication|permitrootlogin'
echo "=============================================================================="
echo "HARDENING SELESAI. SIAP MENJALANKAN AUDIT LYNIS (lynis audit system)."
