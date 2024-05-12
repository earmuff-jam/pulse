-- File: 0024_add_inventories_section_profile_page.up.sql
-- Description: create inventory items for selected profile

SET search_path TO community, public;
CREATE TABLE IF NOT EXISTS community.inventory
(
    id                    UUID PRIMARY KEY         NOT NULL DEFAULT gen_random_uuid(),
    name                  VARCHAR(100)             NOT NULL,
    description           VARCHAR(500),
    price                 DECIMAL(10, 4)                    DEFAULT 0.00,
    status                VARCHAR(100)                      DEFAULT NULL,
    barcode               VARCHAR(100),
    sku                   VARCHAR(100),
    quantity              INT                               DEFAULT 1,
    bought_at             VARCHAR(500),
    location              VARCHAR(500),
    is_transfer_allocated BOOLEAN                  NOT NULL DEFAULT false,
    associated_event_id   UUID                     NULL     DEFAULT NULL,
    storage_location_id   UUID REFERENCES storage_locations (id) ON UPDATE CASCADE ON DELETE CASCADE,
    is_returnable         BOOLEAN                  NOT NULL DEFAULT false,
    return_location       VARCHAR(200)             NULL,
    max_weight            VARCHAR(10)              NULL,
    min_weight            VARCHAR(10)              NULL,
    max_height            VARCHAR(10)              NULL,
    min_height            VARCHAR(10)              NULL,
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by            UUID REFERENCES profiles (id) ON UPDATE CASCADE ON DELETE CASCADE,
    updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by            UUID REFERENCES profiles (id) ON UPDATE CASCADE ON DELETE CASCADE,
    sharable_groups       UUID[]
);

COMMENT ON TABLE inventory IS 'generated inventory for users';

ALTER TABLE community.inventory
    OWNER TO community_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON community.inventory TO community_public;
GRANT SELECT, INSERT, UPDATE, DELETE ON community.inventory TO community_test;
GRANT ALL PRIVILEGES ON TABLE community.inventory TO community_admin;

