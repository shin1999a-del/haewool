# 해울떡 관리 시스템 🍡

해울떡 주문·고객·결제·경비를 관리하는 웹앱입니다。

## Supabase セットアップ

### 1. テーブルの作成

Supabase Dashboard → **SQL Editor** で以下を実行してください:

```sql
-- orders テーブル
create table orders (
  id text primary key,
  customer_name text not null,
  items jsonb default '[]',
  total numeric default 0,
  pickup text,
  status text default 'pending',
  paid boolean default false,
  note text,
  delivery_type text default '방문수령',
  delivery_addr text,
  file_urls jsonb default '[]',
  created_at timestamptz default now()
);

-- customers テーブル
create table customers (
  id text primary key,
  name text not null,
  phone text,
  email text,
  address text,
  note text,
  total_orders integer default 0,
  total_spent numeric default 0,
  created_at timestamptz default now()
);

-- payments テーブル
create table payments (
  id text primary key,
  order_id text references orders(id),
  amount numeric default 0,
  method text,
  date text,
  status text default '완료',
  created_at timestamptz default now()
);

-- expenses テーブル
create table expenses (
  id text primary key,
  category text,
  item text,
  amount numeric default 0,
  vendor text,
  date text,
  created_at timestamptz default now()
);
```

### 2. RLS ポリシーの設定

**Authentication → Policies** で各テーブルに anon アクセスを許可します。

最もシンプルな方法（個人用アプリ向け）:

```sql
-- 全テーブルで anon の全操作を許可
alter table orders enable row level security;
create policy "Allow all for anon" on orders for all to anon using (true) with check (true);

alter table customers enable row level security;
create policy "Allow all for anon" on customers for all to anon using (true) with check (true);

alter table payments enable row level security;
create policy "Allow all for anon" on payments for all to anon using (true) with check (true);

alter table expenses enable row level security;
create policy "Allow all for anon" on expenses for all to anon using (true) with check (true);
```

### 3. ネットワーク制限の確認

**Settings → Network → Restrictions** で IP Allowlist が有効になっている場合、
アクセスを許可する IP を追加するか、制限を無効化してください。

### 4. ファイルストレージ（任意）

注文への画像添付機能を使う場合:

1. **Storage** → **New Bucket** → 名前: `order-files`, Public: ON
2. Storage Policies で anon の upload/download を許可

---

## トラブルシューティング

| エラー | 原因と対処 |
|--------|-----------|
| `Host not in allowlist` | Supabase の Settings → Network → Restrictions で IP 制限が有効。制限を解除してください |
| `relation "orders" does not exist` | テーブルが未作成。上記 SQL を実行してください |
| `new row violates row-level security policy` | RLS ポリシーが未設定。上記 SQL を実行してください |
| テーブルは存在するが何も表示されない | RLS は有効だが SELECT ポリシーがない。ポリシーを確認してください |
